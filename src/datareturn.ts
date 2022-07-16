const axios = require("axios");
const cheerio = require("cheerio");

export function getRegionData():object{
  // let data = {
  //   "대전광역시":{
  //     "서구": [
  //       "정림동", "용문동", "탄방동", "삼천동", "괴정동", "가장동", "내동", "갈마동", "둔산동", "월평동", "가수원동", "도안동", "관저동", "흑성동", "매노동", "산직동", "장안동", "평촌동", "오동", "우명동", "원정동", "용촌동", "봉곡동", "괴곡동", "만년동"
  //     ],
  //     "유성구" : [
  //       "원내동", "교촌동", "대정동", "용계동", "학하동", "게산동", "성북동", "세동", "송정동", "방동", "봉명동", "구암동", "덕명동", "언신흥동", "상대동", "복용동", "장대동", "갑동", "노은동", "지족동", "죽동", "궁동", "어은동", "구성동", "신성동", "가정동", "도룡동", "장동", "방현동", "화암동", "덕진동", "하기동", "자운동", "신봉동", "수남동", "안산동", "외삼동", "반석동", "문지동", "전민동", "원촌동", "탑립동", "용산동", "봉산동", "관편동", "송강동", "금고동", "대동", "금탄동", "신동", "둔곡동"
  //     ]
  //   }
  let data =[
  {"state":"대전광역시","area":"서구","town":"용문동"},
  {"state":"대전광역시","area":"서구","town":"탄방동"},
  {"state":"대전광역시","area":"서구","town":"가장동"},
  {"state":"대전광역시","area":"서구","town":"갈마동"},
  {"state":"대전광역시","area":"서구","town":"둔산동"},
  {"state":"대전광역시","area":"서구","town":"월평동"},
  {"state":"대전광역시","area":"서구","town":"가수원동"},
  {"state":"대전광역시","area":"서구","town":"도안동"},
  {"state":"대전광역시","area":"서구","town":"관저동"},
  {"state":"대전광역시","area":"서구","town":"흑석동"},
  {"state":"대전광역시","area":"서구","town":"만년동"},
  {"state":"대전광역시","area":"유성구","town":"봉명동"},
  {"state":"대전광역시","area":"유성구","town":"구암동"},
  {"state":"대전광역시","area":"유성구","town":"원신흥동"},
  {"state":"대전광역시","area":"유성구","town":"죽동"},
  {"state":"대전광역시","area":"유성구","town":"궁동"},
  {"state":"대전광역시","area":"유성구","town":"어은동"},
  {"state":"대전광역시","area":"유성구","town":"신성동"},
  {"state":"대전광역시","area":"유성구","town":"도룡동"},
  {"state":"대전광역시","area":"유성구","town":"관평동"},
  {"state":"대전광역시","area":"유성구","town":"구룡동"},
  {"state":"대전광역시","area":"대덕구","town":"오정동"},
  {"state":"대전광역시","area":"대덕구","town":"송촌동"},
  {"state":"대전광역시","area":"대덕구","town":"신탄진동"},
  {"state":"대전광역시","area":"동구","town":"용계동"},
  {"state":"대전광역시","area":"동구","town":"신흥동"},
  {"state":"대전광역시","area":"동구","town":"판암동"},
  {"state":"대전광역시","area":"동구","town":"신안동"},
  {"state":"대전광역시","area":"중구","town":"은행동"},
  {"state":"대전광역시","area":"중구","town":"목동"},
  {"state":"대전광역시","area":"중구","town":"대흥동"},
  {"state":"대전광역시","area":"중구","town":"용두동"},
  {"state":"대전광역시","area":"중구","town":"태평동"},
  ]



  

let returnData = {};
let prevState :string = "";
let prevArea:string = "";
data.forEach(element => {
  if(element.state == prevState){
    if(element.area == prevArea){
      console.log(`same state and same area ! - town : ${element.area} | ${element.town}`);
      returnData[prevState][prevArea].push(element.town);
    }else{
      console.log(`same state and new area ! - town : ${element.area} |  ${element.town}`);
      returnData[prevState][element.area] = [];
      returnData[prevState][element.area].push(element.town);
      prevArea = element.area;
    }
  }else{
    console.log(`new state and new area ! - town : ${element.area} |  ${element.town}`);
    returnData[element.state] = {};
    returnData[element.state][element.area] = [];
    returnData[element.state][element.area].push(element.town);
    prevArea = element.area;
    prevState = element.state;
  }
  }
    
  );

  console.log(returnData);

  return returnData;
}
export async function getItemData(url : string){
  let ulList = [];
  const getHtml = async () => {
    try {
      return await axios.get(url);
    }catch(error){
      console.error(error);
    }
  }
  return getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.cunit_lst_v ul").children("li.cunit_t232");
    // console.log($bodyList);
    let j = 0;
    $bodyList.each(function(i, elem){
      if(j<25){
        ulList[i] = {
        name: $(this).find("em.tx_ko").text(),
        imgUrl: $(this).find("img").attr('src'),
        orgPrice: parseInt($(this).find("div.org_price em").text().replace(',','')),
        salePrice: parseInt($(this).find("div.opt_price em").text().replace(',','')),
        rate: parseFloat($(this).find("div.rating div span span").text().substring(3, 7))
        // dueDate: $(this).find("dt.image img")
      } 

      }
      j++;
    })
    let noNaNCount = 0;
    // const data = ulList.filter(n=>{
    //   if(!isNaN(n.orgPrice)){
    //     noNaNCount ++;
    //   }
    //   return (!isNaN(n.orgPrice));
    // });
    ulList.forEach((e)=>{
      if(isNaN(e.orgPrice)){
        console.log("NaN!");
        noNaNCount ++;
        e.orgPrice = e.salePrice + Math.floor(Math.random()*e.salePrice*0.5);
      }
    })

    // console.log(`Number of Sales product is ${noNaNCount}`);
    
    console.log(`Number of not Sales product is ${noNaNCount}`);
    return ulList;

    // return ulList;
  });
}