import { Item } from "src/domain/Item";
import { Joiner } from "src/domain/Joiner";
import { Like } from "src/domain/Like";
import { User } from "src/domain/User";

export function userGen(id:string, pw:string, name: string, iskakao:boolean):User{
  const user = new User();
  user.id = id;
  user.name = name;
  user.password = pw;
  if(iskakao){
    user.isActive = false;
  }else{
    user.isActive = true;
  }
  user.budget = 0;
  user.iskakao = iskakao;
  return user;
}

export function itemListFormat(itemList: Item[]):object[]{
  const resultItemList = itemList.map((e)=>{
    const date = e.dueDate;
    const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return {
      id:e.id,
      name:e.name,
      rate:e.rate,
      orgPrice:e.orgPrice,
      salePrice:e.salePrice,
      minMan:e.minMan,
      nowMan:e.nowMan,
      dueDate:newDueDate,
      imgUrl:e.imgUrl,
      category:e.category,
      state:e.state,
      area:e.area,
      town:e.town,
      likes:e.likes,
      joiners:e.joiners
    }
  });
  return resultItemList;
}

export function itemFormat(e: Item):object{
  const date = e.dueDate;
  const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const resultItem = {
    id:e.id,
    name:e.name,
    rate:e.rate,
    orgPrice:e.orgPrice,
    salePrice:e.salePrice,
    minMan:e.minMan,
    nowMan:e.nowMan,
    dueDate:newDueDate,
    imgUrl:e.imgUrl,
    category:e.category,
    state:e.state,
    area:e.area,
    town:e.town,
    likes:e.likes,
    joiners:e.joiners
  };
  return resultItem;
}

export function itemListFormatWithUsersJoinLike(itemList:Item[], joinedList:Joiner[], likedList:Like[]):object[]{
  const joinedIdList = joinedList.map((e)=>{
    return e.item.id;
  });
  const likedIdList = likedList.map((e)=>{
    return e.item.id;
  });
  const resultItemList = itemList.map((e)=>{
    const date = e.dueDate;
    const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const result = {
      id:e.id,
      name:e.name,
      rate:e.rate,
      orgPrice:e.orgPrice,
      salePrice:e.salePrice,
      minMan:e.minMan,
      nowMan:e.nowMan,
      dueDate:newDueDate,
      imgUrl:e.imgUrl,
      category:e.category,
      state:e.state,
      area:e.area,
      town:e.town,
      likes:e.likes,
      joiners:e.joiners,
      userJoinedIt: false,
      userLikedIt: false,
    }
    if(joinedIdList.includes(e.id)){
      result.userJoinedIt = true;
    }
    if(likedIdList.includes(e.id)){
      result.userLikedIt = true;
    }
    return result;
  });
  return resultItemList;
  };

  export function itemFormatWithUserJoinLike(e: Item, joinedList:Joiner[], likedList:Like[]):object{
    const joinedIdList = joinedList.map((e)=>{
      return e.item.id;
    });
    // console.log("joinedIdList is ...");
    // console.log(joinedIdList);
    const likedIdList = likedList.map((e)=>{
      return e.item.id;
    });
    // console.log("likedIdList is...");
    // console.log(likedIdList);
    const date = e.dueDate;
    const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const resultItem = {
      id:e.id,
      name:e.name,
      rate:e.rate,
      orgPrice:e.orgPrice,
      salePrice:e.salePrice,
      minMan:e.minMan,
      nowMan:e.nowMan,
      dueDate:newDueDate,
      imgUrl:e.imgUrl,
      category:e.category,
      state:e.state,
      area:e.area,
      town:e.town,
      likes:e.likes,
      joiners:e.joiners,
      userJoinedIt: false,
      userLikedIt: false,
    };
    if(joinedIdList.includes(e.id)){
      resultItem.userJoinedIt = true;
    }
    if(likedIdList.includes(e.id)){
      console.log("user Liked It!");
      resultItem.userLikedIt = true;
    }
    // console.log("resultItem is : ");
    // console.log(resultItem);
    return resultItem;
  }

  export function itemListFilterWithSearchWord(itemList, searchWord:string):object[]{
    const resultItemList = itemList.filter((e)=>{
      return ((e.name).includes(searchWord));
    });
    return resultItemList;
  }