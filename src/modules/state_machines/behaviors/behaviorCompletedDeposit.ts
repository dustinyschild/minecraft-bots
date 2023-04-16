import { StateBehavior } from 'mineflayer-statemachine';

export class BehaviorCompletedDeposit implements StateBehavior {
  stateName: string = 'Deposit Completed';
  active: boolean = false;
}
