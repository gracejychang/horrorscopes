let zodiacCycle = new ZodiacCycle({ parentElement: '#vis-nodes' });
let formatTime = d3.timeFormat("%m/%d");

let astrologySignsData= {
  "Aquarius": d3.timeDay.range(new Date(0000, 0, 20), new Date(0000, 1, 18), 1), 
  "Pisces": d3.timeDay.range(new Date(0000, 1, 19), new Date(0000, 2, 20), 1),
  "Aries": d3.timeDay.range(new Date(0000, 2, 21), new Date(0000, 3, 19), 1),
  "Taurus": d3.timeDay.range(new Date(0000, 3, 21), new Date(0000, 4, 20), 1),
  "Gemini": d3.timeDay.range(new Date(0000, 4, 21), new Date(0000, 5, 20), 1),
  "Cancer": d3.timeDay.range(new Date(0000, 5, 21), new Date(0000, 6, 22), 1),
  "Leo": d3.timeDay.range(new Date(0000, 6, 23), new Date(0000, 7, 22), 1),
  "Virgo": d3.timeDay.range(new Date(0000, 7, 23), new Date(0000, 8, 22), 1),
  "Libra": d3.timeDay.range(new Date(0000, 8, 23), new Date(0000, 9, 22), 1),
  "Scorpio": d3.timeDay.range(new Date(0000, 9, 23), new Date(0000, 10, 21), 1),
  "Sagittarius": d3.timeDay.range(new Date(0000, 10, 22), new Date(0000, 11, 21), 1),
  "Capricorn": d3.timeDay.range(new Date(0000, 11, 22), new Date(0001, 0, 20), 1)
}

const elements = ["fire", "earth", "air", "water"];
//TODO move somewhere else? try modules or static class again?
const signsElementsDict = {
  "Aquarius": "air",
  "Pisces": "water",
  "Aries": "fire",
  "Taurus": "earth",
  "Gemini": "air",
  "Cancer": "water",
  "Leo": "fire",
  "Virgo": "earth",
  "Libra": "air",
  "Scorpio": "water",
  "Sagittarius": "fire",
  "Capricorn": "earth"
}


let signsAndSerialKillers = {
  "Aquarius": [],
  "Pisces": [],
  "Aries": [],
  "Taurus": [],
  "Gemini": [],
  "Cancer": [],
  "Leo": [],
  "Virgo": [],
  "Libra": [],
  "Scorpio": [],
  "Sagittarius": [],
  "Capricorn": [],
  "Unknown": []
}

function formatAstrologyDates(){

  signs = Object.keys(astrologySignsData);

  signs.forEach(d => {

    formatedDates = [];
    let dates = astrologySignsData[d];

    dates.forEach(date => {
      changeDate = formatTime(date);
      formatedDates.push(changeDate);
    });

    astrologySignsData[d] = formatedDates;
  })
};

// Load data
Promise.all([
  d3.csv('data/collective-serial-killer-database.csv')
]).then(files => {
  serialKillersData = files[0];

  // format signs dates to correct format
  formatAstrologyDates();

  serialKillersData.forEach(d => {
    birthday = formatTime(new Date(d.Birthday));
    signs = Object.keys(astrologySignsData);

    killerTypesString = d.Type;
    d.Type = killerTypesString.split(", ");

    killerNicknameString = d.Nickname;
    d.Nickname = killerNicknameString.split(", ");

    //match serial killer with sign based on birthday
    //if birthday exists
    if(birthday != "NaN/NaN")
    {
      signs.forEach(sign => {
        formatedDates = [];
        let dates = astrologySignsData[sign];

        dates.forEach(date => {
          if(date == birthday){

            // push entire serial killer attribute to 
            // list based on astrological sign
            signsAndSerialKillers[sign].push(d);
          }
        });
      });
    } else {
      signsAndSerialKillers["Unknown"].push(d);
    }
  });

  zodiacCycle.data = signsAndSerialKillers;
  zodiacCycle.elements = elements;
  zodiacCycle.signsElementsDict = signsElementsDict;
  zodiacCycle.update();

});

console.log(signsAndSerialKillers);


///////////////////////
// INTERACTIVE ELEMENTS

$("#view-toggle").on("click", function() {
  isCyclicView = $(this).text() == "Cyclic View";

  zodiacCycle.isCyclicView = !isCyclicView;
  zodiacCycle.update();

  // Update button label
  $(this)[0].innerHTML = (isCyclicView ? "Element Group View" : "Cyclic View");
});
//
//var interval;
//$("#float-toggle").on("click", function() {
//  floatOn = $(this).text() == "Float On";
//
//  // Update button label
//  $(this)[0].innerHTML = (floatOn ? "Float Off" : "Float On");
//
//  // Toggle float
//  //  dogHouse.floatOn = !floatOn;
//  //
//  //  if (!floatOn) {
//  //    interval = setInterval(() => {
//  //      dogHouse.floatOn = !dogHouse.floatOn
//  //      dogHouse.update();
//  //    }, 2000);
//  //  } else {
//  //    clearInterval(interval);
//  //  }
//  //
//  //  dogHouse.update();
//});

// Float on start
//$("#float-toggle").click();