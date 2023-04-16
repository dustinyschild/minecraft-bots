import { StateBehavior } from 'mineflayer-statemachine';

export class BehaviorCompletedStandBy implements StateBehavior {
  stateName: string = 'Stand By Complete';
  active: boolean = false;
}
