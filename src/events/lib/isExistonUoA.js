import axios from 'axios'
import moment from 'moment'

moment.locale = 'ja'

export default async (isbn) => {
  
  const { data } = await axios.get(`https://uoa-library-api-aqcscfif6a-an.a.run.app/api/v1/search?pageSize=10&isbn=${isbn}`);
  console.log(JSON.stringify(data))
  return (data.length ? data[0].collections : false)

  }
