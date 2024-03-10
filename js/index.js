const requestDB = require('./app.js');
const info_playgounds_tb = require('./info_playgrounds_tb.js');

let allQuery = "SELECT " + info_playgounds_tb.ADM_AREA.en + " FROM " + info_playgounds_tb.INFO_PLAYGROUND_NAME + ";";
requestDB(allQuery, (err, result) => {
  if (err) {
    console.error('Ошибка выполнения запроса к базе данных: ', err);
  } else {
    console.log(result);
  }
});

const posts = document.querySelector('.posts');
const pagination = document.querySelector('.pagination');

function completionPosts() {
  let allQuery = "SELECT " +info_playgounds_tb.ID+ ","
  +info_playgounds_tb.OBJECT_NAME+","
  + info_playgounds_tb.ADDRESS.en + ","
  +" FROM " 
  + info_playgounds_tb.INFO_PLAYGROUND_NAME + ";";
  requestDB(allQuery, (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса к базе данных: ', err);
    } else {
      console.log(result);
    }
  });
}



