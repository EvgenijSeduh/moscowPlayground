const requestDB = require('./app.js');
const info_playgounds_tb = require('./info_playgrounds_tb.js');

let allQuery = "SELECT "+ info_playgounds_tb.ADM_AREA.en+" FROM " + info_playgounds_tb.INFO_PLAYGROUND_NAME + ";";
requestDB(allQuery, (err, result) => {
  if (err) {
    console.error('Ошибка выполнения запроса к базе данных: ', err);
  } else {
    console.log(result);
  }
});


