import moment from "moment";

export function getTime(totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return "00:00";
  }
  let duration = moment.duration(totalSeconds, "seconds");
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  let stringTimer = "";
  stringTimer += hours ? "" + hours + ":" : "";
  stringTimer += minutes ? (minutes < 10 ? "0" : "") + minutes + ":" : "00:";
  stringTimer += seconds < 10 ? "0" + seconds : seconds;

  return stringTimer;
}
