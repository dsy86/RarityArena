document.body.style.cssText = self.location != top.location ? "margin:0px": "margin:15px";

String.prototype.format = function(args) 
{
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
             }
          }
       }
   }
   return result;
}

var number = function(i) 
{
    if (isNaN(parseInt(i)) == false) {
        i = parseInt(i)
    } else {
        i = 0
    }
    return i
}

var $ = function(id) {
    return document.getElementById(id)
}

function DisableInput(disabled) 
{
    p1Name.disabled = disabled;
    p2Name.disabled = disabled;
    SH.disabled = disabled;
    HP.disabled = disabled;
    OK.disabled = disabled;
}

function player(name, level, attackTimer, index, stat, statMax)
{
    this.name        = name;
    this.level       = level;
    this.attackTimer = attackTimer;
    this.index       = index;
    this.stat        = stat;
    this.statMax     = statMax;
}

var p1AttackTimer;
var p2AttackTimer;
var p1 = new player($('p1Name').value, $('p1Level').value, p1AttackTimer, 0, [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]);
var p2 = new player($('p2Name').value, $('p2Level').value, p2AttackTimer, 0, [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]);
var timer = 500; //文字显示速度
var hpAdd = 200; //额外增加HP值

function FixHP(stat)
{
    return parseInt(stat + hpAdd) + number(HP.value);
}

function CalcAtkInterval(speed)
{
    return number(Math.pow(1000 / (30 + speed / 10), 3) / 60)
}

function EndBattle()
{
    clearTimeout(p1.attackTimer);
    clearTimeout(p2.attackTimer);
    DisableInput(false);
}

function StartBattle() 
{
    clearTimeout(p1.attackTimer)
    clearTimeout(p2.attackTimer)
    DisableInput(true);

    var Hex = function(i) {
        return parseInt(parseInt(i, 16) / 820) + 20
    }

    p1.name = $('p1Name').value;
    p2.name = $('p2Name').value;
    p1.level = $('p1Level').value;
    p2.level = $('p2Level').value;
    p1.index = 0;
    p2.index = 0;

    for (var i = 0; i < 8; i++) {
        p1.statMax[i] = p1.stat[i] = number(Hex(hex_md5(p1.name).substr(i * 4, 4)) * (1 + (p1.level - 1) * 0.02));
        p2.statMax[i] = p2.stat[i] = number(Hex(hex_md5(p2.name).substr(i * 4, 4)) * (1 + (p2.level - 1) * 0.02));
    }
    p1.statMax[0] = p1.stat[0] = FixHP(p1.stat[0] + p1.stat[1] + p1.stat[2] + p1.stat[3] + p1.stat[4] + p1.stat[5] + p1.stat[6] + p1.stat[7]);
    p2.statMax[0] = p2.stat[0] = FixHP(p2.stat[0] + p2.stat[1] + p2.stat[2] + p2.stat[3] + p2.stat[4] + p2.stat[5] + p2.stat[6] + p2.stat[7]);

    p1.statMax[7] = p1.stat[7] = parseInt((p1.stat[1] + p1.stat[6] + p1.stat[7]) / 3);
    p1.statMax[7] = p2.stat[7] = parseInt((p2.stat[1] + p2.stat[6] + p2.stat[7]) / 3);

    for (var i = 0; i < 8; i++) {
        $('p1Stat' + i).innerHTML = "<font color='#00AA00'>" + p1.stat[i] + "</font>/" + p1.statMax[i];
        $('p2Stat' + i).innerHTML = "<font color='#00AA00'>" + p2.stat[i] + "</font>/" + p2.statMax[i];
    }
    // var T = "战斗开始" + "\r\n\r\n";
    // T += p1.name + "  HP:" + (p1.statMax[0] - number(HP.value)) + (number(HP.value) != 0 ? "+" + number(HP.value) : "") + " 攻:" + p1.statMax[1] + " 防:" + p1.statMax[2] + " 速:" + p1.statMax[3] + " 技:" + p1.statMax[4] + " 运:" + p1.statMax[5] + " 智:" + p1.statMax[6] + " 品:" + p1.statMax[7] + "\r\n";
    // T += p2.name + "  HP:" + (p2.statMax[0] - number(HP.value)) + (number(HP.value) != 0 ? "+" + number(HP.value) : "") + " 攻:" + p2.statMax[1] + " 防:" + p2.statMax[2] + " 速:" + p2.statMax[3] + " 技:" + p2.statMax[4] + " 运:" + p2.statMax[5] + " 智:" + p2.statMax[6] + " 品:" + p2.statMax[7] + "\r\n";
    // $('Text').value = T + "\r\n";

    p1.attackTimer = setTimeout("Attack(p1.index,'p1')", CalcAtkInterval(p1.statMax[3]));
    p2.attackTimer = setTimeout("Attack(p2.index,'p2')", CalcAtkInterval(p2.statMax[3]) + 300);
}

function Attack(index, attacker) 
{
    var md5 = "0" + hex_md5($(attacker + "Name").value);
    var spellID = parseInt(md5.substr(index % 32, 2), 16) % 32
    if (attacker == "p1") {
        if (p1.stat[0] > 0) p1.attackTimer = setTimeout("Attack(p1.index++,'p1')", CalcAtkInterval(p1.stat[3]));
        DoAttack(spellID, attacker, p2.stat, p1.stat, p2.statMax, p1.statMax);
    } else {
        if (p2.stat[0] > 0) p2.attackTimer = setTimeout("Attack(p2.index++,'p2')", CalcAtkInterval(p2.stat[3]));
        DoAttack(spellID, attacker, p1.stat, p2.stat, p1.statMax, p2.statMax);
    }
}

var lang = {
    spell0:       "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell1_1:     "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell1_2:     "[{attacker}]向[{victim}]发起攻击，但是被[{victim}]闪开了。",
    spell2:       "[{attacker}]向[{victim}]发起攻击，[{victim}]防御，[{victim}]受到{damage}点伤害。",
    spell3_1:     "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell3_2:     "[{attacker}]向[{victim}]发起攻击，但是没打着，被[{victim}]反击损伤{damage}点伤害。",
    spell4_1:     "[{attacker}]作出垂死抗争，所有属性提升了10%。",
    spell4_2:     "[{attacker}]服用了伟哥，提升了{damage}点体力。",
    spell5_1:     "[{attacker}]诅咒[{victim}]，[{victim}]所有数值下降10%。",
    spell5_2:     "[{attacker}]诅咒[{victim}]，[{victim}]所有数值下降10%。",
    spell6:       "[{attacker}]诅咒[{victim}]，但是没有成功，[{attacker}]的体力降低10%。",
    spell7:       "[{attacker}]一拳打得[{victim}]满地找牙，[{victim}]受到{damage}点伤害。",
    spell8_1:     "[{attacker}]发狂了，上前咬了[{victim}]一口，[{victim}]受到{damage}点伤害。",
    spell8_2:     "[{attacker}]发狂了，上前咬了[{victim}]一口，但是遭到[{victim}]反击，体力减少{damage}点。",
    spell9_1:     "[{attacker}]约凤姐与[{victim}]相亲，[{victim}]非常满意，[{attacker}]属性提升10%。",
    spell9_2:     "[{attacker}]邀凤姐与[{victim}]私会，[{victim}]功能衰退，设备损伤10%。",
    spell10:      "[{attacker}]用吃奶的力气咬了[{victim}]一口，[{victim}]受到{damage}点伤害。",
    spell11:      "[{attacker}]冲上去咬了[{victim}]一口，但牙齿被打掉了，[{attacker}]体力减少{damage}点。",
    spell12_1:    "[{attacker}]请春哥前来爆菊花，[{victim}]强列反抗，但还是受到{damage}点伤害。",
    spell12_2:    "[{attacker}]请春哥前来爆菊花，[{victim}]受到{damage}点伤害。",
    spell13:      "[{attacker}]携凤姐出现，[{victim}]兽性大发，[{victim}]属性降低了10%。",
    spell14:      "[{attacker}]拿出电动玩具对[{victim}]实施侵犯，[{victim}]受到{damage}点伤害。",
    spell15_1:    "[{attacker}]向[{victim}]发起攻击，但受到[{victim}]反击，[{attacker}]体力减少{damage}点。",
    spell15_2:    "[{attacker}]向[{victim}]发起攻击，[{victim}]体力减少{damage}点。",
    spell16:      "[{attacker}]使出降龙一巴掌，[{victim}]受到{damage}点伤害。",
    spell17_1:    "[{attacker}]使出降龙一巴掌，[{victim}]受到{damage}点伤害。",
    spell17_2:    "[{attacker}]使出降龙一巴掌，却不敌[{victim}]的乾坤大挪移，受到{damage}点伤害。",
    spell18_1:    "[{attacker}]使用金创药，确被[{victim}]抢去吃了,[{victim}]体力恢复了{damage}点。",
    spell18_2:    "[{attacker}]使用金创药，体力恢复了{damage}点。",
    spell19:      "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell20:      "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell21:      "[{attacker}]向[{victim}]投毒，[{victim}]用大粪还击，[{attacker}]所有数值下降10%。",
    spell22_1:    "[{attacker}]向[{victim}]投毒，[{victim}]所有数值下降10%。",
    spell22_2:    "[{attacker}]向[{victim}]投毒，[{victim}]体力下降了{damage}点。",
    spell23_1:    "[{attacker}]送三鹿奶粉给[{victim}]喝，[{victim}]走狗屎运,体力恢复{damage}点。",
    spell23_2:    "[{attacker}]送三鹿奶粉给[{victim}]喝，[{victim}]内分秘失调，体力受损{damage}点。",
    spell24_1:    "[{attacker}]被打晕了，[{victim}]趁机偷袭，[{attacker}]受到{damage}点伤害。",
    spell24_2:    "[{attacker}]向[{victim}]发起攻击,但是被[{victim}]闪开了。",
    spell25_1:    "[{attacker}]送充气娃娃给[{victim}]，[{victim}]越战越猛，体力提高{damage}点。",
    spell25_2:    "[{attacker}]送充气娃娃给[{victim}]，[{victim}]乐不思蜀，体力受损{damage}点。",
    spell26_1:    "[{attacker}]使用马铁锤砸向[{victim}]，[{victim}]头破血流，受到{damage}点伤害。",
    spell26_2:    "[{attacker}]使用马铁锤砸向[{victim}]，但是没有命中，[{victim}]没有受到伤害。",
    spell27:      "[{attacker}]送脑白金给[{victim}]喝，[{victim}]长得膘肥体状,属性降低了10%。",
    spell28_1:    "[{attacker}]使用马铁锤砸向[{victim}]，[{victim}]头破血流,受到{damage}点伤害。",
    spell28_2:    "[{attacker}]使用马铁锤砸向[{victim}]，但是没有命中，[{victim}]没有受到伤害。",
    spell29_1:    "[{attacker}]拿出电动玩具对[{victim}]实施侵犯，[{victim}]受到{damage}点伤害。",
    spell29_2:    "[{attacker}]拿出电动玩具对[{victim}]实施侵犯，[{victim}]不感兴趣，没有受到损伤。",
    spell30_1:    "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell30_2:    "[{victim}]发动连续攻击，但都被[{attacker}]躲过去了。",
    spell31_1:    "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    spell31_2:    "[{attacker}]被打晕了，[{victim}]继续发动攻击。",
    spellDefault: "[{attacker}]向[{victim}]发起攻击，[{victim}]受到{damage}点伤害。",
    winner:       "[{winner}]获得了胜利！\r\n"
}

function DoAttack(spellID, attacker, victimStat, attackerStat, victimStatMax, attackerStatMax) 
{
    var E = function(i) {
        if (number(i) < 0) {
            i = 0
        }
        return number(i)
    }
    //如果有人死了
    if (p1.stat[0] <= 0 || p2.stat[0] <= 0) 
        return;
    //第一次进攻必定为普攻
    if (p1.index == 0 || p2.index == 0) {
        spellID = 0
    } 

    var attackerName = attacker == "p1" ? p1.name: p2.name;
    var victimName = attacker == "p1" ? p2.name: p1.name;

    var damage = 0;
    var text = "";
    var text2 = "";

    switch (spellID) 
    {
        case 0:
            text = "[%attacker%]向[%victim%]发起攻击,[%victim%]受到" + E(E(victimStat[0] * 0.1 - victimStat[2] + attackerStat[1]) + victimStat[0] * 0.05) + "点伤害";
            damage = E(E(victimStat[0] * 0.1 - victimStat[2] + attackerStat[1]) + victimStat[0] * 0.05);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell0;
            break;
        case 1:
            text = "[%attacker%]向[%victim%]发起攻击," + ((attackerStat[4] < victimStat[4]) ? "但是被[%victim%]闪开了": "[%victim%]受到" + E(E(victimStat[0] * 0.1 - victimStat[2]) + attackerStat[4] + victimStat[0] * 0.05) + "点伤害");
            if (attackerStat[4] >= victimStat[4]) 
            {
                damage = E(E(victimStat[0] * 0.1 - victimStat[2]) + attackerStat[4] + victimStat[0] * 0.05);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell1_1;
            }
            else
                text2 = lang.spell1_2;
            break;
        case 2:
            text = "[%attacker%]向[%victim%]发起攻击,[%victim%]防御,[%victim%]受到" + E(attackerStat[1] * attackerStat[4] / 200) + "点伤害";
            damage = E(attackerStat[1] * attackerStat[4] / 200);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell2;
            break;
        case 3:
            text = "[%attacker%]向[%victim%]发起攻击," + (attackerStat[4] > victimStat[4] ? "[%victim%]受到" + E(E(attackerStat[1] + attackerStat[4] - 50) + victimStat[0] * 0.05) + "点伤害": "但是没打着,被[%victim%]反击损伤" + E(victimStat[0] * 0.1 + victimStat[1] + victimStat[4]) + "点");
            if (attackerStat[4] > victimStat[4]) {
                damage = E(E(attackerStat[1] + attackerStat[4] - 50) + victimStat[0] * 0.05);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell3_1;
            } else {
                damage = E(victimStat[0] * 0.1 + victimStat[1] + victimStat[4]);
                attackerStat[0] = E(attackerStat[0] - damage);
                text2 = lang.spell3_2;
            }
            break;
        case 4:
            text = ((attackerStat[0] < attackerStatMax[0] / 5 && attackerStat[0] < victimStat[0]) ? "[%attacker%]作出垂死抗争,所有数值上升10%": "[%attacker%]服用了伟哥,[%attacker%]的体力增加了" + E(attackerStatMax[0] * 0.1) + "点");
            if (attackerStat[0] < attackerStatMax[0] / 5 && attackerStat[0] < victimStat[0]) {
                for (var i = 0; i < 8; i++) {
                    attackerStat[i] = E(attackerStat[i] + E(attackerStatMax[i] * 0.1))
                }
                text2 = lang.spell4_1;
            } else {
                damage = E(attackerStatMax[0] * 0.1);
                attackerStat[0] += damage;
                text2 = lang.spell4_2;
            }
            break;
        case 5:
            text = (attackerStat[4] > victimStat[4] ? "[%attacker%]诅咒[%victim%],[%victim%]所有数值下降10%": "[%attacker%]辱骂[%victim%],[%victim%]发怒了,武力增加10%");
            if (attackerStat[4] > victimStat[4]) {
                for (var i = 0; i < 8; i++) {
                    victimStat[i] = E(victimStat[i] - E(victimStatMax[i] * 0.1))
                }
                text2 = lang.spell5_1;
            } else {
                victimStat[1] = E(victimStat[1] + victimStatMax[1] * 0.1)
                text2 = lang.spell5_2;
            }
            break;
        case 6:
            text = "[%attacker%]诅咒[%victim%],但是没有成功,[%attacker%]的体力降低10%";
            attackerStat[0] = E(attackerStat[0] - attackerStatMax[0] * 0.1);
            text2 = lang.spell6;
            break
        case 7:
            text = (attackerStat[1] < victimStat[1] ? "[%attacker%]一拳打得[%victim%]满地找牙": "[%attacker%]一脚踢中了[%victim%]的命根子") + ",[%victim%]受到" + E(E(victimStat[0] * 0.1 + attackerStat[1] - victimStat[2]) + victimStat[0] * 0.05) + "点伤害";
            damage = E(E(victimStat[0] * 0.1 + attackerStat[1] - victimStat[2]) + victimStat[0] * 0.05);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell7;
            break;
        case 8:
            text = "[%attacker%]发狂了,上前咬了[%victim%]一口," + (attackerStat[1] > victimStat[1] ? "[%victim%]受到" + E(victimStat[0] * 0.1 + attackerStat[1]) + "点伤害": "但是遭到[%victim%]反击,体力减少" + E(attackerStat[0] * 0.1 + victimStat[1]) + "点");
            if (attackerStat[1] > victimStat[1]) {
                damage = E(victimStat[0] * 0.1 + attackerStat[1]);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell8_1;
            } else {
                damage = E(attackerStat[0] * 0.1 + victimStat[1]);
                attackerStat[0] = E(attackerStat[0] - damage);
                text2 = lang.spell8_2;
            }
            break;
        case 9:
            text = (attackerStat[6] > victimStat[6] ? "[%attacker%]约凤姐与[%victim%]相亲,[%victim%]非常满意,[%attacker%]属性提升10%": "[%attacker%]邀凤姐与[%victim%]私会,[%victim%]功能衰退,设备损伤10%");
            if (attackerStat[6] > victimStat[6]) {
                for (var i = 0; i < 8; i++) {
                    attackerStat[i] = E(attackerStat[i] + E(attackerStatMax[i] * 0.1))
                }
                text2 = lang.spell9_1;
            } else {
                for (var i = 0; i < 8; i++) {
                    victimStat[i] = E(victimStat[i] - E(victimStatMax[i] * 0.1))
                }
                text2 = lang.spell9_2;
            }
            break;
        case 10:
            text = "[%attacker%]用吃奶的力气咬了[%victim%]一口,[%victim%]受到" + E((attackerStat[1] + victimStat[1] - victimStat[2]) * attackerStat[4] / 100) + "点伤害";
            damage = E((attackerStat[1] + victimStat[1] - victimStat[2]) * attackerStat[4] / 100);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell10;
            break;
        case 11:
            text = "[%attacker%]冲上去咬了[%victim%]一口,但牙齿被打掉了,[%attacker%]体力减少" + E(victimStat[1]) + "点";
            damage = E(victimStat[1]);
            attackerStat[0] = E(attackerStat[0] - damage);
            text2 = lang.spell11;
            break;
        case 12:
            text = "[%attacker%]请春哥前来爆菊花,[%victim%]" + (victimStat[6] > attackerStat[6] || victimStat[7] > attackerStat[7] ? "强列反抗,但还是受到" + E(victimStat[0] * 0.1 + attackerStat[6]) + "点伤害": "受到" + E(victimStat[0] * 0.1 + attackerStat[6]) + "点伤害");
            if (victimStat[6] > attackerStat[6] || victimStat[7] > attackerStat[7]) {
                damage = E(victimStat[0] * 0.1 + attackerStat[6]);
                text2 = lang.spell12_1;
            } else {
                damage = E(victimStat[0] * 0.1 + attackerStat[6]);
                text2 = lang.spell12_2;
            }
            victimStat[0] = victimStat[0] - E(victimStat[0] * 0.1 + attackerStat[6])
            break;
        case 13:
            text = "[%attacker%]携凤姐出现,[%victim%]兽性大发,[%victim%]属性降低了10%";
            for (var i = 0; i < 8; i++) {
                victimStat[i] = E(victimStat[i] - E(victimStatMax[i] * 0.1))
            }
            text2 = lang.spell13;
            break;
        case 14:
            text = "[%attacker%]拿出电动玩具对[%victim%]实施侵犯,[%victim%]受到" + E(victimStat[0] * 0.1 + attackerStat[1] + attackerStat[7]) + "点伤害";
            damage = E(victimStat[0] * 0.1 + attackerStat[1] + attackerStat[7]);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell14;
            break;
        case 15:
            text = "[%attacker%]向[%victim%]发起攻击," + (attackerStat[1] < victimStat[1] ? "但受到[%victim%]反击,[%attacker%]体力减少" + E(attackerStat[0] * 0.1 + victimStat[1]) + "点": "[%victim%]体力减少" + E(victimStat[0] * 0.1 + attackerStat[1]) + "点");
            if (attackerStat[1] < victimStat[1]) {
                damage = E(attackerStat[0] * 0.1 + victimStat[1]);
                attackerStat[0] = E(attackerStat[0] - damage);
                text2 = lang.spell15_1;
            } else {
                damage = E(victimStat[0] * 0.1 + attackerStat[1]);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell15_2;
            }
            break;
        case 16:
            text = "[%attacker%]使出降龙一巴掌,[%victim%]受到" + E(victimStat[0] * attackerStat[1] / 100 * (100 - victimStat[2]) / 100) + "点伤害";
            damage = E(victimStat[0] * attackerStat[1] / 100 * (100 - victimStat[2]) / 100);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell16;
            break;
        case 17:
            text = "[%attacker%]使出降龙一巴掌," + (attackerStat[1] > victimStat[1] || attackerStat[6] > victimStat[6] ? "[%victim%]受到" + E(victimStat[0] * 0.1 + attackerStat[1]) + "点伤害": "却不敌[%victim%]的乾坤大挪移,受到" + E(attackerStat[0] * 0.1 + victimStat[1]) + "点伤害");
            if (attackerStat[1] > victimStat[1] || attackerStat[6] > victimStat[6]) {
                damage = E(victimStat[0] * 0.1 + attackerStat[1]);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell17_1;
            } else {
                damage = E(attackerStat[0] * 0.1 + victimStat[1]);
                attackerStat[0] = E(attackerStat[0] - damage);
                text2 = lang.spell17_2;
            }
            break;
        case 18:
            text = "[%attacker%]使用金创药," + ((victimStat[5] > attackerStat[5] || victimStat[0] < attackerStat[0] / 2) ? "确被[%victim%]抢去吃了,[%victim%]体力恢复了" + E(victimStat[0] * 0.1 + victimStat[5]) + "点": "[%attacker%]体力恢复" + E(attackerStatMax[0] * 0.1 + attackerStat[5]) + "点");
            if (victimStat[5] > attackerStat[5] || victimStat[0] < attackerStat[0] / 2) {
                damage = E(victimStatMax[0] * 0.1 + victimStat[5])
                victimStat[0] += damage;
                text2 = lang.spell18_1;
            } else {
                damage = E(attackerStatMax[0] * 0.1 + attackerStat[5]);
                attackerStat[0] += damage;
                text2 = lang.spell18_2;
            }
            break;
        case 19:
            text = "[%attacker%]向[%victim%]发起攻击,[%victim%]受到" + E(attackerStat[1] * attackerStat[4] / 100 + victimStat[0] * 0.05) + "点伤害";
            damage = E(attackerStat[1] * attackerStat[4] / 100 + victimStat[0] * 0.05);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell19;
            break;
        case 20:
            text = "[%attacker%]向[%victim%]发起攻击,[%victim%]受到" + E(attackerStat[1] * 2 - victimStat[2] + victimStat[0] * 0.05) + "点伤害";
            damage = E(attackerStat[1] / 2 - victimStat[2] + victimStat[0] * 0.05);
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spell20;
            break;
        case 21:
            text = "[%attacker%]向[%victim%]投毒,[%victim%]用大粪还击,[%attacker%]所有数值下降10%";
            for (var i = 0; i < 8; i++) {
                attackerStat[i] = E(attackerStat[i] - E(attackerStatMax[i] * 0.1))
            }
            text2 = lang.spell21;
            break;
        case 22:
            text = "[%attacker%]向[%victim%]投毒," + (victimStat[6] < attackerStat[6] ? "[%victim%]所有数值下降10%": "[%victim%]体力下降了" + E(victimStatMax[0] * 0.1) + "点");
            if (victimStat[6] < attackerStat[6]) {
                for (var i = 0; i < 8; i++) {
                    victimStat[i] = E(victimStat[i] - E(victimStatMax[i] * 0.1))
                }
                text2 = lang.spell22_1;
            } else {
                damage = E(victimStatMax[0] * 0.1);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell22_2;
            }
            break;
        case 23:
            text = "[%attacker%]送三鹿奶粉给[%victim%]喝," + ((victimStat[5] > attackerStat[5]) ? "[%victim%]走狗屎运,体力恢复" + (victimStat[0] < 50 && victimStat[0] < attackerStat[0] ? E(victimStat[0] * 0.1) : E(victimStat[5] * 0.1)) + "点": "[%victim%]内分秘失调,体力受损" + E(attackerStat[5] + victimStat[0] * 0.1) + "点");
            if (victimStat[5] > attackerStat[5]) {
                damage = (victimStat[0] < 50 && victimStat[0] < attackerStat[0] ? E(victimStat[0] * 0.1) : E(victimStat[5] * 0.1));
                victimStat[0] += damage;
                text2 = lang.spell23_1;
            } else {
                damage = E(attackerStat[5] + victimStat[0] * 0.1);
                victimStat[0] = victimStat[0] - damage;
                text2 = lang.spell23_2;
            }
            break;
        case 24:
            text = ((victimStat[3] > attackerStat[3]) ? "[%attacker%]被打晕了,[%victim%]趁机偷袭,[%attacker%]受到" + E(victimStat[3] / 2) + "点伤害": "[%attacker%]向[%victim%]发起攻击,但是被[%victim%]闪开了");
            if (victimStat[3] > attackerStat[3]) {
                damage = E(victimStat[3] / 2);
                attackerStat[0] = E(attackerStat[0] - damage);
                text2 = lang.spell24_1;
            }
            else
                text2 = lang.spell24_2;
            break;
        case 25:
            text = "[%attacker%]送充气娃娃给[%victim%]," + (victimStat[6] > attackerStat[6] ? "[%victim%]越战越猛,体力提高" + E(attackerStat[6] / 2) + "点": "[%victim%]乐不思蜀,体力受损" + E(attackerStat[6] + victimStat[0] * 0.1) + "点");
            if (victimStat[6] > attackerStat[6]) {
                damage = E(attackerStat[6] / 2);
                victimStat[0] += damage;
                text2 = lang.spell25_1;
            } else {
                damage = E(attackerStat[6] + victimStat[0] * 0.1);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell25_2;
            }
            break;
        case 26:
            text = "[%attacker%]使用马铁锤砸向[%victim%]," + ((attackerStat[4] < victimStat[4]) ? "但是没有命中,[%victim%]没有受到伤害": "[%victim%]头破血流,受到" + E(attackerStat[1] + 100 - victimStat[2] + E(victimStat[0] * 0.1)) + "点伤害");
            if (victimStat[4] < attackerStat[4]) {
                damage = (attackerStat[1] + 100 - victimStat[2] + E(victimStat[0] * 0.1));
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell26_1;
            }
            else
                text2 = lang.spell26_2;
            break;
        case 27:
            text = "[%attacker%]送脑白金给[%victim%]喝," + (victimStat[6] < attackerStat[6] ? "[%victim%]长得膘肥体状,属性降低了10%": "[%victim%]长得四肢发达,属性降低了10%");
            for (var i = 0; i < 8; i++) {
                victimStat[i] = E(victimStat[i] - E(victimStatMax[i] * 0.1))
            }
            text2 = lang.spell27;
            break;
        case 28:
            text = "[%attacker%]使用马铁锤砸向[%victim%]," + ((attackerStat[4] < victimStat[4]) ? "但是没有命中,[%victim%]没有受到伤害": "[%victim%]头破血流,受到" + E(attackerStat[1] + 100 - victimStat[2] + E(victimStat[0] * 0.1)) + "点伤害");
            if (victimStat[4] < attackerStat[4]) {
                damage = (attackerStat[1] + 100 - victimStat[2] + E(victimStat[0] * 0.1));
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell28_1;
            }
            else
                text2 = lang.spell28_2;
            break;
        case 29:
            text = "[%attacker%]拿出电动玩具对[%victim%]实施侵犯," + ((attackerStat[7] < victimStat[7]) ? "[%victim%]不感兴趣,没有受到损伤": "[%victim%]受到" + E(attackerStat[7] + 100 - victimStat[7] + E(victimStat[0] * 0.1)) + "点伤害");
            if (victimStat[7] < attackerStat[7]) {
                damage = E(attackerStat[7] + 100 - victimStat[7] + E(victimStat[0] * 0.1));
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell29_1;
            }
            else
                text2 = lang.spell29_2;
            break;
        case 30:
            text = (attackerStat[3] > victimStat[3]) ? "[%attacker%]向[%victim%]发起攻击,[%victim%]受到" + E(attackerStat[3] + victimStat[0] * 0.05) + "点伤害": "[%victim%]发动连继攻击";
            if (victimStat[3] < attackerStat[3]) {
                damage = E(attackerStat[3] + victimStat[0] * 0.05);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell30_1;
            }
            else
                text2 = lang.spell30_2;
            break;
        case 31:
            text = (attackerStat[2] > victimStat[2]) ? "[%attacker%]向[%victim%]发起攻击,[%victim%]受到" + E(E(victimStat[0] * 0.1 - victimStat[2]) + attackerStat[1]) + "点伤害": "[%attacker%]被打得晕了,[%victim%]继续发动攻击";
            if (attackerStat[2] > victimStat[2]) {
                damage = E(E(victimStat[0] * 0.1 - victimStat[2]) + attackerStat[1]);
                victimStat[0] = E(victimStat[0] - damage);
                text2 = lang.spell31_1;
            }
            else
                text2 = lang.spell31_2;
            break;
        default:
            text = "[%attacker%]向[%victim%]发起攻击,[%victim%]受到" + E(E(victimStat[0] * 0.1 - victimStat[2]) + E(victimStat[0] * 0.05)) + "点伤害";
            damage = E(E(victimStat[0] * 0.1 - victimStat[2]) + E(victimStat[0] * 0.05));
            victimStat[0] = E(victimStat[0] - damage);
            text2 = lang.spellDefault;
            break;
    }
    $('Text').value += text.replace(/%attacker%/g, attackerName).replace(/%victim%/g, victimName) + "\r\n";
    $("Text").value += /*"【技能ID:" + spellID + "】 " + */text2.format({attacker:attackerName, victim:victimName, damage:damage}) + "\r\n";

    for (var i = 0; i < 8; i++) {
        p1.stat[i] = E(p1.stat[i])
        p2.stat[i] = E(p2.stat[i])
        var color = p1.stat[i] >= p1.statMax[i] ? "#00AA00" : "#FF0000"
        $('p1Stat' + i).innerHTML = "<font color='" + color +"'>" + p1.stat[i] + "</font>/" + p1.statMax[i];
        color = p2.stat[i] >= p2.statMax[i] ? "#00AA00" : "#FF0000"
        $('p2Stat' + i).innerHTML = "<font color='" + color +"'>" + p2.stat[i] + "</font>/" + p2.statMax[i];    
    }

    if (p1.stat[0] <= 0 || p2.stat[0] <= 0)
    {
        $('Text').value += lang.winner.format({winner:p1.stat[0] <= 0 ? p2.name : p1.name});
        EndBattle();
    }
}
