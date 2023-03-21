import { Bot } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Block } from 'prismarine-block';
import { Vec3 } from 'vec3';
import { crops } from '../config';
import { asyncTimeout } from '../helpers';
import { Boundary } from '../types';
import { CropType, Field } from '../types/farmer';

export class BehaviorSowField implements StateBehavior {
  stateName: string = 'Sow Field';
  active: boolean = false;
  bot: Bot;
  targets: StateMachineTargets;
  finished: boolean = false;

  constructor(bot: Bot, targets: StateMachineTargets) {
    this.bot = bot;
    this.targets = targets;
  }

  onStateEntered = async () => {
    this.finished = false;
    const field = this.targets.item.fieldToHarvest as Field;

    // filter empty blocks
    const fieldBlocks = this.getBlocksIn(field.boundary).filter(
      (block) => block.name === 'air',
    );

    await this.plantField(fieldBlocks, field.crop);

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

  plantField = async (sowableBlocks: Block[], cropType: CropType) => {
    let noSeeds = false;

    await this.bot.equip(crops[cropType].sowableItem, 'hand').catch(() => {
      this.bot.chat(`I don't have seeds for ${cropType}`);
      noSeeds = true;
    });

    for (let block of sowableBlocks) {
      if (noSeeds) return;

      await asyncTimeout(100);

      if (this.bot.heldItem?.type !== crops[cropType].sowableItem) {
        await this.bot.equip(crops[cropType].sowableItem, 'hand').catch(() => {
          console.log('No more seeds');
          noSeeds = true;
        });
      }

      await this.plant(block);
    }
  };

  plant = async (block: Block) => {
    const { x, y, z } = block.position;
    const blockToSow = this.bot.blockAt(new Vec3(x, y - 1, z));

    if (blockToSow?.name === 'farmland') {
      await this.bot.pathfinder.goto(
        new goals.GoalNearXZ(blockToSow.position.x, blockToSow.position.z, 1),
      );
      await this.bot
        .placeBlock(blockToSow, new Vec3(0, 1, 0))
        .catch((err) => console.error(err));
    }
  };

  isFinished = () => this.finished;
}
