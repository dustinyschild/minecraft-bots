export const asyncTimeout = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export const timeIn = {
  seconds: (secs: number) => secs * SECONDS,
  minutes: (mins: number) => mins * MINUTES,
  hours: (hrs: number) => hrs * MINUTES,
  days: (ds: number) => ds * DAYS,
};

export const copy = (toCopy: any) => JSON.parse(JSON.stringify(toCopy));
