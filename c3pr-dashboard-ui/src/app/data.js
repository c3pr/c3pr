import moment from "moment";

const today = moment();

export function formatarData(d) {
  return d && moment(d).format("YYYY-MM-DD HH:mm:SS")
}
export function diasAtras(d) {
  return d && moment(d).fromNow()
}
export function isToday(d) {
  return d && moment(d).isSame(today, 'day')
}
