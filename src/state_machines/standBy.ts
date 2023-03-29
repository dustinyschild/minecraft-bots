import { Bot } from 'mineflayer';
import { NestedStateMachine, StateTransition } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import {
  BehaviorCompletedStandBy,
  BehaviorStandBy,
  BehaviorWait,
} from '../behaviors';
import { timeIn } from '../helpers';
import { ICoordinate } from '../types';

export const loadStandByStateMachine = (
  bot: Bot,
  position: ICoordinate,
  waitTime: number,
) => {
  const behaviorWait = new BehaviorWait(waitTime);
  const behaviorStandBy = new BehaviorStandBy(bot, new Vec3(...position));
  const behaviorStandByComplete = new BehaviorCompletedStandBy();

  const standByStateMachine = new NestedStateMachine(
    [
      new StateTransition({
        name: 'behaviorStandBy => behaviorWait',
        parent: behaviorStandBy,
        child: behaviorWait,
        shouldTransition: behaviorStandBy.isFinished,
        onTransition: () => {
          console.info('Transitioning: behaviorStandBy => behaviorWait');
        },
      }),
      new StateTransition({
        parent: behaviorWait,
        child: behaviorStandByComplete,
        shouldTransition: behaviorWait.isFinished,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorWait => behaviorStandByComplete',
          );
        },
      }),
    ],
    behaviorStandBy,
    behaviorStandByComplete,
  );
  standByStateMachine.stateName = 'Stand By';

  return standByStateMachine;
};
