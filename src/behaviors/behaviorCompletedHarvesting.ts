import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';

export class BehaviorCompletedHarvesting implements StateBehavior {
  stateName: string = 'Harvesting Complete';
  active: boolean = false;

  targets: StateMachineTargets;

  constructor(targets: StateMachineTargets) {
    this.targets = targets;
  }

  onStateEntered = () => {
    this.targets.item.fieldToHarvest = null;
  };
}
