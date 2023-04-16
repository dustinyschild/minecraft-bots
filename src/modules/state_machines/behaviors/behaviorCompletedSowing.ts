import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';

export class BehaviorCompletedSowing implements StateBehavior {
  stateName: string = 'Sowing Complete';
  active: boolean = false;

  targets: StateMachineTargets;

  constructor(targets: StateMachineTargets) {
    this.targets = targets;
  }

  onStateEntered = () => {
    this.targets.item.fieldToSow = null;
  };
}
