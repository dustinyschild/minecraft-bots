import { StateBehavior } from 'mineflayer-statemachine';

export class BehaviorWithdrawalItems implements StateBehavior {
  stateName: string = 'Withdrawal Items';
  active: boolean = false;
}
