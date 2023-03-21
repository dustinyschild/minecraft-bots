import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { Block } from 'prismarine-block';
import { crops } from '../config';
import { Boundary } from '../types';
import { Field } from '../types/farmer';

export class BehaviorCheckFields implements StateBehavior {
  stateName: string = 'Check Fields';
  active: boolean = false;

  targets: StateMachineTargets;
  fields: Field[];
  bot: Bot;
  interval?: ReturnType<typeof setInterval>;
  harvestThreshold: number;

  constructor(bot: Bot, targets: StateMachineTargets, fields: Field[]) {
    this.bot = bot;
    this.targets = targets;
    this.fields = fields;

    this.harvestThreshold = 0.5;
  }

  onStateEntered = () => {
    // find farm with most harvestableBlocks
    let fieldToHarvest: Field | null = null;
    let highestYield = 0;

    // get the field with the highest yieldRatio that exceeds threshold value
    for (let field of this.fields) {
      const yieldRatio = this.getYieldableRatio(field);

      if (yieldRatio >= this.harvestThreshold && yieldRatio > highestYield) {
        highestYield = yieldRatio;
        fieldToHarvest = field;
      }
    }

    this.targets.item.fieldToHarvest = fieldToHarvest;
  };

  getYieldableRatio = (field: Field) => {
    const fieldBlocks = this.getFarmableBlocks(field);
    const harvestableCrops = this.readyToHarvest(fieldBlocks);

    return harvestableCrops.length / fieldBlocks.length;
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

    console.log({ startX, endX, startZ, endZ });

    let fieldBlocks: Block[] = [];
    for (let x = startX; x <= endX; x++) {
      for (let z = startZ; z <= endZ; z++) {
        console.log({ x, z });

        const block = this.bot.blockAt(new Vec3(x, -60, z));
        console.log(block?.position);

        fieldBlocks.push(block as Block);
      }
    }

    return fieldBlocks;
  };

  getFarmableBlocks = (field: Field) =>
    this.getBlocksIn(field.boundary).filter(({ position }) => {
      const { x, y, z } = position;
      return this.bot.blockAt(new Vec3(x, y - 1, z))?.name === 'farmland';
    });

  readyToHarvest = (cropBlocks: Block[]) => {
    return cropBlocks.filter(
      (crop) => crop.metadata === crops[crop.name]?.harvestableAge,
    );
  };

  shouldHarvest = () => !!this.targets.item.fieldToHarvest;
}
