import { Bot } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Block } from 'prismarine-block';
import { Vec3 } from 'vec3';
import { asyncTimeout } from '../../../helpers';
import { IBoundary } from '../../../types';
import { IField } from '../../../types/farmer';

export class BehaviorSowField implements StateBehavior {
  stateName: string = 'Sow Field';
  active: boolean = false;
  bot: Bot;
  targets: StateMachineTargets;
  finished: boolean = false;
  noSeeds: boolean = false;

  constructor(bot: Bot, targets: StateMachineTargets) {
    this.bot = bot;
    this.targets = targets;
  }

  onStateEntered = async () => {
    this.finished = false;
    this.noSeeds = false;

    const field = this.targets.item.fieldToSow as IField;

    // filter empty blocks
    const fieldBlocks = this.getBlocksIn(field.boundary).filter(
      (block) => block.name === 'air',
    );

    await this.plantField(fieldBlocks, field.seed);

    this.finished = true;
  };

  getXRange = (boundary: IBoundary) => {
    const [startPosition, endPosition] = boundary;
    const [startX] = startPosition;
    const [endX] = endPosition;

    const smallerX = startX > endX ? endX : startX;
    const biggerX = startX < endX ? endX : startX;

    return [smallerX, biggerX];
  };

  getZRange = (boundary: IBoundary) => {
    const [startPosition, endPosition] = boundary;
    const [, , startZ] = startPosition;
    const [, , endZ] = endPosition;

    const smallerZ = startZ > endZ ? endZ : startZ;
    const biggerZ = startZ < endZ ? endZ : startZ;

    return [smallerZ, biggerZ];
  };

  getBlocksIn = (boundary: IBoundary): Block[] => {
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

  plantField = async (sowableBlocks: Block[], seedName: string) => {
    const seedType = this.bot.registry.itemsByName[seedName].id as number;

    for (const block of sowableBlocks) {
      await asyncTimeout(300);

      if (this.bot.heldItem?.name !== seedName) {
        await this.bot.equip(seedType, 'hand').catch(() => {
          console.log('No more seeds');

          this.noSeeds = true;
        });
      }

      if (this.noSeeds) {
        break;
      } else {
        await this.plant(block);
      }
    }
  };

  plant = async (block: Block) => {
    const blockToSow = this.bot.blockAt(
      block.position.clone().translate(0, -1, 0),
    );

    if (blockToSow?.name === 'farmland') {
      await this.bot.pathfinder.goto(
        new goals.GoalNearXZ(blockToSow.position.x, blockToSow.position.z, 1),
      );
      await this.bot.placeBlock(blockToSow, new Vec3(0, 1, 0)).catch((err) => {
        // ignore block placement errors
        console.log(err.message);
      });
    }
  };

  outOfSeeds = () => {
    return this.noSeeds;
  };

  isFinished = () => {
    return this.finished && !this.noSeeds;
  };
}
