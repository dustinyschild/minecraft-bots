import { Bot } from 'mineflayer';
import { NestedStateMachine, StateTransition } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { BehaviorStandBy, BehaviorWait } from '../behaviors';
import { timeIn } from '../helpers';
import { Coordinate } from '../types';

export const loadStandByStateMachine = (
  bot: Bot,
  position: Coordinate,
  waitTime: number,
) => {
  const behaviorWait = new BehaviorWait(waitTime);
  const behaviorStandBy = new BehaviorStandBy(bot, new Vec3(...position));

  const standByStateMachine = new NestedStateMachine(
    [
      new StateTransition({
        name: 'behaviorStandBy => behaviorWait',
        parent: behaviorStandBy,
        child: behaviorWait,
        shouldTransition: behaviorStandBy.isFinished,
        onTransition: () => {
          console.log('Transitioning: behaviorStandBy => behaviorWait');
        },
      }),
    ],
    behaviorStandBy,
    behaviorWait,
  );
  standByStateMachine.stateName = 'Stand By';

  return standByStateMachine;
};
