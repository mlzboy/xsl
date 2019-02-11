// var dayjs = require("dayjs")

var dayjs = require("./moment-im.js");




function get_first_day(sday, xweek) {
  if (xweek <= 0) return "0000-00-00"
  let d, ret;
  if (xweek > 1)
    d = dayjs(sday, "YYYY-MM-DD").subtract(xweek - 1, "week")
  else
    d = dayjs(sday, "YYYY-MM-DD")
  // console.log(d.day()) //星期天是第0天，星期一是第1天
  // console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzz", d.isoWeekday())
  if (d.isoWeekday() == 7) {
    // console.log("T")
    // console.log(d.day(-6).format("YYYY-MM-DD"))
    ret = d.isoWeekday(1)
  }
  else if (d.isoWeekday() == 1) {
    // console.log("V")
    // console.log(d.format("YYYY-MM-DD"))
    ret = d
  }
  else {
    // console.log("F")
    // console.log("--------------")
    // console.log(d)
    // console.log(d.day(1).format("YYYY-MM-DD"))
    ret = d.isoWeekday(1)
  }
  return ret
}

// console.log(get_first_day("2019-09-10",2))
// console.log(get_first_day("2019-09-9",2))
// console.log(get_first_day("2019-09-8",2))
// console.log(get_first_day("2019-09-8",1))

function copy(x) {
  return JSON.parse(JSON.stringify(x))
}


function row_pair_day(first_day, xweek) {
  let start, end
  // console.log("ttttt",first_day)
  start = first_day.isoWeekday(1 + (xweek - 1) * 7)
  end = first_day.isoWeekday(7 + (xweek - 1) * 7).endOf("day")
  return [start, end]
}


function get_data(xdate, xweek, weeks) {
  let _term_data
  if (_has_key("term_data"))
  {
    _term_data = _get("term_data")
  }
  else{
    _term_data = gen_data(xdate,xweek,weeks)
  }
  return _term_data
}

/*
 基于xdate,xweek生成first_day
 基于first_day,weeks生成循环data数据
*/
function gen_data(xdate, xweek, weeks) {

  let first_day = get_first_day(xdate, xweek)

  let ret = []

  for (let i = 1; i <= weeks; ++i) {
    let row = []
    let courses_per_day = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let courses = [copy(courses_per_day),
    copy(courses_per_day),
    copy(courses_per_day),
    copy(courses_per_day),
    copy(courses_per_day),
    copy(courses_per_day),
    copy(courses_per_day)
    ]

    let start, end
    [start, end] = row_pair_day(first_day, i)
    // console.log(start, end)
    row.push(courses)
    row.push(start.format("MM.DD"))
    row.push(end.format("MM.DD"))
    let now = dayjs()
    // console.log("now", now)
    if ((start.isBefore(now) == true) && (now.isBefore(end) == true)) {
      row.push(now.isoWeekday() - 1)
    }
    else {
      row.push(-1)
    }
    // console.log(row)
    ret.push(row)
  }
  _set("term_data",ret)
  return ret
}



function _set(key,value)
{
  wx.setStorageSync(key.toString(), value)
  //dict[key]= value
}

function _get(key)
{
  return wx.getStorageSync(key.toString());
  //return dict[key]
}

function _has_key(key)
{

  var r = wx.getStorageSync(key.toString());
  return r == '' ? false : true
  //return dict.hasOwnProperty(key)==true ? true:false
}

function _del(key)
{
  wx.removeStorageSync(key)
}


// gen_data("2019-02-10",2,2)
/*
term_data 学期数据每周是一行
[ 
  [ 
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  '12.15',
  '12.15',
  -1
]
xweek是1-x
day是1-7
start_course end_course是1-12
*/
function add_course(start_week,end_week,day,start_course,end_course)
{
    if ((start_week > end_week) || (start_course > end_course)) return -1
    
    for (let xweek = start_week; xweek <= end_week; ++xweek)
    {
      _add_course_for_one_week(xweek,day,start_course,end_course)
    }
}


function _add_course_for_one_week(xweek,day,start_course,end_course)
{
  let term_data = _get("term_data")
  // console.log("term_data at localstorage.................",term_data)
  for(let xcourse = start_course; xcourse <= end_course; ++xcourse)
  {
    term_data[xweek-1][0][day-1][xcourse-1] = 1
  }
  _set("term_data",term_data)
}

function clear_course()
{
  _del("term_data")
}

function save_data_to_localstorage(xweek,xdate,xschool,weeks)
{
  _set("xweek",xweek)
  _set("xdate",xdate)
  _set("xschool",xschool)
  _set("weeks",weeks)
}

/*
term_data参数未使用，只为保持输出一致性
*/
function load_data_from_localstorage(xweek,xdate,xschool,weeks,term_data)
{
  let _xweek,_xdate,_xschool,_weeks,_term_data
  if (_has_key("xweek"))
  {
    _xweek = _get("xweek")
    console.log(typeof _xweek)
  }
  else{
    _xweek = xweek
  }

  if (_has_key("xdate"))
  {
    _xdate = _get("xdate")
    console.log(typeof _xdate)
  }
  else{
    _xdate = xdate
  }

  if (_has_key("xschool"))
  {
    _xschool = _get("xschool")
    console.log(typeof _xschool)
  }
  else{
    _xschool = xschool
  }

  if(_has_key("weeks"))
  {
    _weeks = _get("weeks")
    console.log(typeof _weeks)
  }
  else
  {
    _weeks = weeks
  }

  if (_has_key("term_data"))
  {
    _term_data = _get("term_data")
    // console.log(typeof _term_data)
  }
  else
  {
    _term_data = gen_data(_xdate,_xweek,_weeks)
  }
  return [_xweek,_xdate,_xschool,_weeks,_term_data]

}

// console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
// console.log(gen_data("2019-02-10", 2, 2).length)
// console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
module.exports={
  get_data:get_data,
  gen_data:gen_data,
  add_course:add_course,
  clear_course:clear_course,
  load_data_from_localstorage:load_data_from_localstorage,
  save_data_to_localstorage:save_data_to_localstorage
}