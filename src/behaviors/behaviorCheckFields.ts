import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { Block } from 'prismarine-block';
import { Boundary } from '../types';
import { Field } from '../types/farmer';

export class BehaviorCheckFields implements StateBehavior {
  stateName: string = 'Check Fields';
  active: boolean = false;

  targets: StateMachineTargets;
  fields: Field[];
  bot: Bot;
  harvestThreshold: number;

  constructor(bot: Bot, targets: StateMachineTargets, fields: Field[]) {
    this.bot = bot;
    this.targets = targets;
    this.fields = fields;

    this.harvestThreshold = 0.5;
  }

  onStateEntered = () => {
    for (let field of this.fields) {
      const cropBlocks = this.getBlocksIn(field.boundary);

      const hasUnsownBlocks = this.hasUnsownBlocks(cropBlocks);
      const hasHarvestableBlocks = this.hasHarvestableBlocks(
        cropBlocks,
        field.maturity,
      );

      // immediately start harvest if field is not at capacity
      if (hasUnsownBlocks && hasHarvestableBlocks) {
        this.targets.item.fieldToHarvest = field;
        break;
      } else if (hasUnsownBlocks && !hasHarvestableBlocks) {
        this.targets.item.fieldToSow = field;
        break;
      }

      // skip harvest if no harvestable blocks
      if (!hasHarvestableBlocks) {
        console.log('no farmable blocks');

        break;
      }

      // find farm with most harvestableBlocks
      let highestYield = 0;
      const farmableBlocks = this.getHarvestableBlocks(
        cropBlocks,
        field.maturity,
      );
      const yieldRatio = this.getYieldableRatio(farmableBlocks);

      if (yieldRatio >= this.harvestThreshold && yieldRatio > highestYield) {
        highestYield = yieldRatio;
        this.targets.item.fieldToHarvest = field;
      }
    }
  };

  getYieldableRatio = (fieldBlocks: Block[]) => {
    const harvestableCrops = fieldBlocks.filter(this.readyToHarvest);

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

    const [, y] = boundary[0];

    let fieldBlocks: Block[] = [];
    for (let x = startX; x <= endX; x++) {
      for (let z = startZ; z <= endZ; z++) {
        const block = this.bot.blockAt(new Vec3(x, y, z));

        fieldBlocks.push(block as Block);
      }
    }

    return fieldBlocks;
  };

  hasUnsownBlocks = (fieldBlocks: Block[]) => {
    return fieldBlocks.some((block) => {
      const isEmpty = block.name === 'air';
      const isOnFarmland =
        this.bot.blockAt(block.position.clone().translate(0, -1, 0))?.name ===
        'farmland';
      return isEmpty && isOnFarmland;
    });
  };

  hasHarvestableBlocks = (fieldBlocks: Block[], maturity: number) => {
    return fieldBlocks.some((block) => {
      const farmlandBlock = this.bot.blockAt(
        block.position.clone().translate(0, -1, 0),
      )?.name;

      return (
        farmlandBlock === 'farmland' && this.readyToHarvest(block, maturity)
      );
    });
  };

  getHarvestableBlocks = (fieldBlocks: Block[], maturity: number) => {
    return fieldBlocks.filter((block) => {
      const isFarmland =
        this.bot.blockAt(block.position.clone().translate(0, -1, 0))?.name ===
        'farmland';

      return isFarmland && this.readyToHarvest(block, maturity);
    });
  };

  readyToHarvest = (cropBlock: Block, maturity: number) => {
    return cropBlock.metadata === maturity;
  };

  shouldHarvest = () => {
    return !!this.targets.item.fieldToHarvest;
  };

  shouldSow = () => {
    console.log(this.targets.item.fieldToSow);

    return !this.shouldHarvest() && !!this.targets.item.fieldToSow;
  };
}
