import { StateBehavior } from 'mineflayer-statemachine/lib/statemachine';

export class BehaviorWait implements StateBehavior {
  stateName: string = 'Wait';
  active: boolean = false;
  finished: boolean = false;
  delay: number;

  constructor(delay: number) {
    this.delay = delay;
  }

  onStateEntered = () => {
    this.finished = false;

    setTimeout(() => {
      this.finished = true;
    }, this.delay);
  };

  isFinished = () => this.finished;
}
