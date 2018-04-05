function Square(name, pricetext, color, price, groupNumber, baserent, rent1, rent2, rent3, rent4, rent5) {
    this.name = name;
    this.pricetext = pricetext;
    this.color = color;
    this.owner = 0;
    this.mortgage = false;
    this.house = 0;
    this.hotel = 0;
    this.groupNumber = groupNumber || 0;
    this.price = (price || 0);
    this.baserent = (baserent || 0);
    this.rent1 = (rent1 || 0);
    this.rent2 = (rent2 || 0);
    this.rent3 = (rent3 || 0);
    this.rent4 = (rent4 || 0);
    this.rent5 = (rent5 || 0);
    this.landcount = 0;

    if (groupNumber === 3 || groupNumber === 4) {
        this.houseprice = 50;
    } else if (groupNumber === 5 || groupNumber === 6) {
        this.houseprice = 100;
    } else if (groupNumber === 7 || groupNumber === 8) {
        this.houseprice = 150;
    } else if (groupNumber === 9 || groupNumber === 10) {
        this.houseprice = 200;
    } else {
        this.houseprice = 0;
    }
}

class Card {
    constructor (text, action) {
        this.text = text;
        this.action = action
    }
}

function corrections() {
    document.getElementById("cell1name").textContent = "Mediter-ranean Avenue";

    // Add images to enlarges.
    document.getElementById("enlarge5token").innerHTML += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; bottom: 20px;" />';
    document.getElementById("enlarge15token").innerHTML += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; top: -20px;" />';
    document.getElementById("enlarge25token").innerHTML += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; top: -20px;" />';
    document.getElementById("enlarge35token").innerHTML += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; top: -20px;" />';
    document.getElementById("enlarge12token").innerHTML += '<img src="../images/electric_icon.png" height="60" width="48" alt="" style="position: relative; top: -20px;" />';
    document.getElementById("enlarge28token").innerHTML += '<img src="../images/water_icon.png" height="60" width="78" alt="" style="position: relative; top: -20px;" />';
}

function utiltext() {
    return '&nbsp;&nbsp;&nbsp;&nbsp;If one "Utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both "Utilitys" are owned rent is 10 times amount shown on dice.';
}

function transtext() {
    return '<div style="font-size: 14px; line-height: 1.5;">Rent<span style="float: right;">$25.</span><br />If 2 Railroads are owned<span style="float: right;">50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>';
}

function luxurytax() {
    addAlert(player[turn].name + " заплатите $100 за попадание на Luxury Tax.");
    player[turn].pay(100, 0);

    $("#landed").show().text("Вы попали на Luxury Tax. Заплатите $100.");
}


function citytax () {
    addAlert(player[turn].name + " заплатите $100 за попадание на City Tax.");
    player[turn].pay(200, 0);
    $("#landed").show().text("Вы попали на City Tax. Заплатите $200.");
}

let square = [];

square[0] = new Square("СТАРТ", "ПОЛУЧИТЕ $200 ПРИ ПРОХОДЕ ЧЕРЕЗ ЭТУ КЛЕТКУ.", "#FFFFFF");
square[1] = new Square("Проспект Богдан Хмельницкого", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
square[2] = new Square("Community Chest", "СЛЕДУЙТЕ ИНСТРУКЦИЯМ НА ВЕРХНЕЙ КАРТОЧКЕ", "#FFFFFF");
square[3] = new Square("ОПЛОТ", "$60", "#8B4513", 60, 3, 4, 20, 60, 180, 320, 450);
square[4] = new Square("Первое республиканское такси", "Заплатите $200", "#FFFFFF");
square[5] = new Square("Донецкий ЖД вокзал", "$200", "#FFFFFF", 200, 1);
square[6] = new Square("Площадь Ленина", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
square[7] = new Square("Коммендантский час", "СЛЕДУЙТЕ ИНСТРУКЦИЯМ НА ВЕРХНЕЙ КАРТОЧКЕ", "#FFFFFF");
square[8] = new Square("Бургер Бар", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
square[9] = new Square("Connecticut Avenue", "$120", "#87CEEB", 120, 4, 8, 40, 100, 300, 450, 600);
square[10] = new Square("Just Visiting", "", "#FFFFFF");
square[11] = new Square("St. Charles Place", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
square[12] = new Square("Electric Company", "$150", "#FFFFFF", 150, 2);
square[13] = new Square("States Avenue", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
square[14] = new Square("Virginia Avenue", "$160", "#FF0080", 160, 5, 12, 60, 180, 500, 700, 900);
square[15] = new Square("Pennsylvania Railroad", "$200", "#FFFFFF", 200, 1);
square[16] = new Square("St. James Place", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
square[17] = new Square("Community Chest", "СЛЕДУЙТЕ ИНСТРУКЦИЯМ НА ВЕРХНЕЙ КАРТОЧКЕ", "#FFFFFF");
square[18] = new Square("Tennessee Avenue", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
square[19] = new Square("New York Avenue", "$200", "#FFA500", 200, 6, 16, 80, 220, 600, 800, 1000);
square[20] = new Square("Free Parking", "", "#FFFFFF");
square[21] = new Square("Kentucky Avenue", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
square[22] = new Square("Chance", "СЛЕДУЙТЕ ИНСТРУКЦИЯМ НА ВЕРХНЕЙ КАРТОЧКЕ", "#FFFFFF");
square[23] = new Square("Indiana Avenue", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
square[24] = new Square("Illinois Avenue", "$240", "#FF0000", 240, 7, 20, 100, 300, 750, 925, 1100);
square[25] = new Square("B&O Railroad", "$200", "#FFFFFF", 200, 1);
square[26] = new Square("Atlantic Avenue", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
square[27] = new Square("Ventnor Avenue", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
square[28] = new Square("Water Works", "$150", "#FFFFFF", 150, 2);
square[29] = new Square("Marvin Gardens", "$280", "#FFFF00", 280, 8, 24, 120, 360, 850, 1025, 1200);
square[30] = new Square("Go to Jail", "Попадаете прямиком в тюрьму. Не проходите через клетку GO. Не получаете $200", "#FFFFFF");
square[31] = new Square("Pacific Avenue", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
square[32] = new Square("North Carolina Avenue", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
square[33] = new Square("Community Chest", "СЛЕДУЙТЕ ИНСТРУКЦИЯМ НА ВЕРХНЕЙ КАРТОЧКЕ", "#FFFFFF");
square[34] = new Square("Pennsylvania Avenue", "$320", "#008000", 320, 9, 28, 150, 450, 1000, 1200, 1400);
square[35] = new Square("Short Line", "$200", "#FFFFFF", 200, 1);
square[36] = new Square("Chance", "СЛЕДУЙТЕ ИНСТРУКЦИЯМ НА ВЕРХНЕЙ КАРТОЧКЕ", "#FFFFFF");
square[37] = new Square("Park Place", "$350", "#0000FF", 350, 10, 35, 175, 500, 1100, 1300, 1500);
square[38] = new Square("LUXURY TAX", "Заплатите $100", "#FFFFFF");
square[39] = new Square("Boardwalks", "$400", "#0000FF", 400, 10, 50, 200, 600, 1400, 1700, 2000);

let communityChestCards = [];
let chanceCards = [];

communityChestCards[0] = new Card("Выйти из тюрьмы, Свобода. Эту карточку можно сохранить до момента надобности или продажи .", function (p) {
    p.communityChestJailCard = true;
    updateOwned();
});
communityChestCards[1] = new Card("Вы заняли второе место в конкурсе красоты. Получите $10.", function () {
    addamount(10, 'Community Chest');
});
communityChestCards[2] = new Card("С продажи акций вы получите $50.", function () {
    addamount(50, 'Community Chest');
});
communityChestCards[3] = new Card("Получите $100 со страховки.", function () {
    addamount(100, 'Community Chest');
});
communityChestCards[4] = new Card("Возврат налога с доходов. Получите $20.", function () {
    addamount(20, 'Community Chest');
});
communityChestCards[5] = new Card("Получите $100 с праздничного фонда .", function () {
    addamount(100, 'Community Chest');
});
communityChestCards[6] = new Card("Вы получаете $100 по наслдству.", function () {
    addamount(100, 'Community Chest');
});
communityChestCards[7] = new Card("Получите $25 с консультаций.", function () {
    addamount(25, 'Community Chest');
});
communityChestCards[8] = new Card("Вы попали в больницу. Заплатите $100 .", function () {
    subtractamount(100, 'Community Chest');
});
communityChestCards[9] = new Card("Ошибка банка в вашу пользу. Получите $200.", function () {
    addamount(200, 'Community Chest');
});
communityChestCards[10] = new Card("Заплатите школьные налоги $50.", function () {
    subtractamount(50, 'Community Chest');
});
communityChestCards[11] = new Card("Услуги доктора. Заплатите $50.", function () {
    subtractamount(50, 'Community Chest');
});
communityChestCards[12] = new Card("Сейчас Ваш День Рождения. Соберите $10 с каждого игрока.", function () {
    collectfromeachplayer(10, 'Community Chest');
});
communityChestCards[13] = new Card("Advance to \"GO\" (Collect $200).", function () {
    advance(0);
});
communityChestCards[14] = new Card("С Вас вас взымаются выплаты: $40 за дом, $115 за отель.", function () {
    streetrepairs(40, 115);
});
communityChestCards[15] = new Card("Отправиться  в тюрьму. Отправляетесь прямо в тюрьму. Не проходите \"СТАРТ\". Не получаете $200.", function () {
    gotojail();
});


chanceCards[0] = new Card("Выйти из тюрьмы, Свобода. Эту карточку можно сохранить до момента надобности или продажи .", function (p) {
    p.chanceJailCard = true;
    updateOwned();
});
chanceCards[1] = new Card("Массовое устранение наполадков на Ваших предприятиях. За каждый дом заплатите $25. За каждый отель - $100.", function () {
    streetrepairs(25, 100);
});
chanceCards[2] = new Card("Штраф ща превышение скорости $15.", function () {
    subtractamount(15, 'Chance');
});
chanceCards[3] = new Card("Вы платите $50 каждому игроку за столом и становитесь его председателем.", function () {
    payeachplayer(50, 'Chance');
});
chanceCards[4] = new Card("Перейти назад на 3 клетки.", function () {
    gobackthreespaces();
});
chanceCards[5] = new Card("ПЕРЕМЕСТИТЕСЬ В БЛИЖАЙШЕЕ ЗАВЕДЕНИЕ. ЕСЛИ ОНО НЕ ПРИНАДЛИЖИТ НИКОМУ, Вы можете купить его. ИНАЧЕ, бросьте кубик и заплатите в 10 раз больше количества, выпавшего на нём", function () {
    advanceToNearestUtility();
});
chanceCards[6] = new Card("Bank pays you dividend of $50.", function () {
    addamount(50, 'Chance');
});
chanceCards[7] = new Card("ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.", function () {
    advanceToNearestRailroad();
});
chanceCards[8] = new Card("Pay poor tax of $15.", function () {
    subtractamount(15, 'Chance');
});
chanceCards[9] = new Card("Take a trip to Reading Rail Road. If you pass \"GO\" collect $200.", function () {
    advance(5);
});
chanceCards[10] = new Card("ADVANCE to Boardwalk.", function () {
    advance(39);
});
chanceCards[11] = new Card("ADVANCE to Illinois Avenue. If you pass \"GO\" collect $200.", function () {
    advance(24);
});
chanceCards[12] = new Card("Your building loan matures. Collect $150.", function () {
    addamount(150, 'Chance');
});
chanceCards[13] = new Card("ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.", function () {
    advanceToNearestRailroad();
});
chanceCards[14] = new Card("ADVANCE to St. Charles Place. If you pass \"GO\" collect $200.", function () {
    advance(11);
});
chanceCards[15] = new Card("Go to Jail. Go Directly to Jail. Do not pass \"GO\". Do not collect $200.", function () {
    gotojail();
});
