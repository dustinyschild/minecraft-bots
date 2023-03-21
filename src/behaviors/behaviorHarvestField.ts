import { Bot } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';
import { uniqBy } from 'lodash';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Block } from 'prismarine-block';
import { Boundary } from '../types';
import { Vec3 } from 'vec3';
import { crops } from '../config';
import { Field } from '../types/farmer';
import { asyncTimeout } from '../helpers';

export class BehaviorHarvestField implements StateBehavior {
  stateName: string = 'Harvest Field';
  active: boolean = false;
  bot: Bot;
  targets: StateMachineTargets;
  finished: boolean = false;
  harvestableCrops: { name: string; harvestableAge: number }[];

  constructor(bot: Bot, targets: StateMachineTargets) {
    this.bot = bot;
    this.targets = targets;

    this.harvestableCrops = Object.entries(crops).map(
      ([name, { harvestableAge }]) => ({ name, harvestableAge }),
    );
  }

  onStateEntered = async () => {
    this.finished = false;
    const farmableBlocks = this.getFarmableBlocks(
      this.targets.item.fieldToHarvest,
    );

    await this.harvestField(farmableBlocks);

    this.finished = true;
  };

  getXRange = (boundary: Boundary) => {
    const [startPosition, endPosition] = boundary;
    const [startX] = startPosition;
    const [endX] = endPosition;

    const smallerX = startX > endX ? endX : startX;
    const biggerX = startX < endX ? endX : startX;

    return [smallerX, biggerX];
  };

  getZRange = (boundary: Boundary) => {
    const [startPosition, endPosition] = boundary;
    const [, , startZ] = startPosition;
    const [, , endZ] = endPosition;

    const smallerZ = startZ > endZ ? endZ : startZ;
    const biggerZ = startZ < endZ ? endZ : startZ;

    return [smallerZ, biggerZ];
  };

  getBlocksIn = (boundary: Boundary): Block[] => {
    const [startX, endX] = this.getXRange(boundary);
    const [startZ, endZ] = this.getZRange(boundary);

    let fieldBlocks: Block[] = [];
    for (let x = startX; x <= endX; x++) {
      for (let z = startZ; z <= endZ; z++) {
        const block = this.bot.blockAt(new Vec3(x, -60, z));
        fieldBlocks.push(block as Block);
      }
    }

    return fieldBlocks;
  };

  getFarmableBlocks = (field: Field) => {
    console.log(this.targets.item.fieldToHarvest);

    return this.getBlocksIn(field.boundary).filter(({ position }) => {
      const { x, y, z } = position;
      return this.bot.blockAt(new Vec3(x, y - 1, z))?.name === 'farmland';
    });
  };

  isHarvestable = (block: Block) => {
    return this.harvestableCrops.some(
      (crop) =>
        block.name === crop.name && block.metadata === crop.harvestableAge,
    );
  };

  harvestField = async (blocks: Block[]) => {
    for (let block of blocks) {
      // skip blocks that should not be harvested
      if (!this.isHarvestable(block)) continue;

      await this.harvestBlock(block);

      await asyncTimeout(300);

      // look for drops within 5 block radius
      const drops = Object.values(this.bot.entities).filter(
        (e) =>
          e.entityType === 45 &&
          e.position.distanceTo(this.bot.entity.position) < 5,
      );

      for (let drop of drops) {
        const { x, z } = drop.position;
        await this.bot.pathfinder.goto(new goals.GoalNearXZ(x, z, 1));
      }
    }
  };

  harvestBlock = async (block: Block) => {
    const { x, z } = block.position;

    await this.bot.pathfinder.goto(new goals.GoalNearXZ(x, z, 1));

    await this.bot.dig(block);
    this.bot.stopDigging();
  };

  isFinished = () => this.finished;
}
