import moment from 'moment'
export const formatDate = (val, format) => {
  if (!val) return ''
  if (!format) {
    format = 'YYYY-MM-DD'
  }
  return moment(new Date(val * 1000)).format(format)
}
