export const demoMenu = [
  { day:"Monday", breakfast:"Aloo Paratha & Curd", lunch:"Rajma Rice", snacks:"Tea & Biscuits", dinner:"Roti, Dal & Mix Veg", options:{breakfast:["Aloo Paratha & Curd","Poha & Tea","Bread & Omelette"],lunch:["Rajma Rice","Chole Rice","Kadahi Rice"],snacks:["Tea & Biscuits","Samosa & Tea","Fruit"],dinner:["Roti, Dal & Mix Veg","Paneer & Roti","Chana Masala"]}},
  { day:"Tuesday", breakfast:"Poha & Tea", lunch:"Chole Rice", snacks:"Samosa & Tea", dinner:"Roti, Dal Tadka & Paneer", options:{breakfast:["Poha & Tea","Aloo Paratha","Sandwich"],lunch:["Chole Rice","Rajma Rice","Veg Pulao"],snacks:["Samosa & Tea","Bread Pakora & Tea","Fruit"],dinner:["Roti, Dal Tadka & Paneer","Kadhi & Rice","Chole & Roti"]}},
  { day:"Wednesday", breakfast:"Bread, Butter & Milk", lunch:"Dal, Rice & Aloo Gobi", snacks:"Tea & Namkeen", dinner:"Roti & Chana Masala", options:{breakfast:["Bread, Butter & Milk","Poha & Tea","Paratha & Curd"],lunch:["Dal, Rice & Aloo Gobi","Rajma Rice","Veg Biryani"],snacks:["Tea & Namkeen","Samosa & Tea","Fruit"],dinner:["Roti & Chana Masala","Paneer & Roti","Dal Tadka & Rice"]}},
  { day:"Thursday", breakfast:"Idli & Sambar", lunch:"Kadhi Rice", snacks:"Tea & Biscuits", dinner:"Roti & Aloo Matar", options:{breakfast:["Idli & Sambar","Poha & Tea","Aloo Paratha"],lunch:["Kadhi Rice","Chole Rice","Dal Rice"],snacks:["Tea & Biscuits","Samosa & Tea","Fruit"],dinner:["Roti & Aloo Matar","Paneer & Roti","Rajma Rice"]}},
  { day:"Friday", breakfast:"Paratha & Curd", lunch:"Chole Bhature", snacks:"Tea & Samosa", dinner:"Roti, Dal & Paneer", options:{breakfast:["Paratha & Curd","Poha & Tea","Sandwich"],lunch:["Chole Bhature","Veg Biryani","Paneer Rice"],snacks:["Tea & Samosa","Bread Pakora & Tea","Fruit"],dinner:["Roti, Dal & Paneer","Chole & Rice","Paneer Roll"]}},
  { day:"Saturday", breakfast:"Aloo Paratha & Tea", lunch:"Veg Biryani & Raita", snacks:"Tea & Biscuits", dinner:"Roti, Dal & Soyabean", options:{breakfast:["Aloo Paratha & Tea","Idli & Sambar","Poha & Tea"],lunch:["Veg Biryani & Raita","Chole Rice","Rajma Rice"],snacks:["Tea & Biscuits","Samosa & Tea","Fruit"],dinner:["Roti, Dal & Soyabean","Paneer & Roti","Chana Masala"]}},
  { day:"Sunday", breakfast:"Chole Bhature", lunch:"Pulao & Raita", snacks:"Tea & Snacks", dinner:"Special Dinner", options:{breakfast:["Chole Bhature","Aloo Paratha","Puri Bhaji"],lunch:["Pulao & Raita","Veg Biryani","Rajma Rice"],snacks:["Tea & Snacks","Samosa & Tea","Fruit"],dinner:["Special Dinner","Paneer Biryani","Chole Bhature"]}}
];

export const demoComplaints = [
  {id:"#MM-1042",type:"Foreign object",text:"Small insect found in dal during lunch.",date:"Today, 1:20 PM",status:"Under Review",user:"Anonymous",meal:"Lunch"},
  {id:"#MM-1038",type:"Food quality",text:"Rice was undercooked during dinner.",date:"Yesterday, 8:10 PM",status:"Action Taken",user:"Aarav",meal:"Dinner"},
  {id:"#MM-1031",type:"Hygiene",text:"Serving spoon was not clean.",date:"04 Oct, 1:05 PM",status:"Resolved",user:"Anonymous",meal:"Lunch"},
  {id:"#MM-1024",type:"Food quality",text:"Sabzi was too oily.",date:"03 Oct, 8:20 PM",status:"Resolved",user:"Riya",meal:"Dinner"}
];

export const demoPolls = [
  {id:"P1",question:"Which item should replace Friday lunch?",ends:"2 days left",total:176,options:[{name:"Chole Bhature",votes:76},{name:"Veg Biryani",votes:58},{name:"Paneer Rice",votes:42}]},
  {id:"P2",question:"Choose next Sunday's breakfast",ends:"5 days left",total:141,options:[{name:"Aloo Paratha",votes:62},{name:"Poha",votes:48},{name:"Sandwich",votes:31}]},
  {id:"P3",question:"Which evening snack should be added?",ends:"7 days left",total:119,options:[{name:"Samosa",votes:51},{name:"Bread Pakora",votes:39},{name:"Fruit Bowl",votes:29}]}
];