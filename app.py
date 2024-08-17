# APP.PY CODED BY CHRISPLAYZBLOX/YT ON JULY 1ST, 2024
# DO NOT LEAK THE WAD WHILE IN BETA, WE WILL BAN YOU FROM THE SERVER.

# WII SHOP GUIDES START

# put  at the top of the page for it to work properly 

# <script> shop.disableHRP(); // Disable Home Button Menu. </script>
# <script> shop.enableHRP(); // Enable Home Button Menu. </script>

# put  at the top of the page for it to work properly 

#  shop.returnToMenu()   : Return to Wii Menu
#  shop.beginWaiting()   : begin to display the waiting icon.
#  shop.endWaiting()     : end to display the waiting icon.

#  shop.jumpDataMng()    : Jump to Data Management screen in Wii option
#  shop.launchCode()  : Get launch code value
#  shop.returnToUpdate() : Return to Update screen screen in Wii option


#  shop.setWallpaper(0,1,2,3)  : change the wallpaper of the shop bg

# NUMBER: 0 = DEFAULT Blue fade and White color
# NUMBER: 1 = Black color screen
# NUMBER: 2 = White color screen
# NUMBER: 3 = Blue fade horizontal line


#  shop.connecting     : The connecting message strings.
#
#  shop.error( errorcode, errortype ) : jump to local error html.
#


# SHOP BTN SOUNDS START

# button sounds when button clicked: onclick="wiiSelectSound();"  onMouseDown="if(snd) snd.playSE( cSE_Decide );"  onMouseOver="snd.playSE( cSE_Forcus );"

# button sounds when button clicked (GOING BACK): onclick="wiiCancelSound();"  onMouseDown="if(snd) snd.playSE( cSE_Decide );"  onMouseOver="snd.playSE( cSE_Forcus );"

# button sounds when button hover: onmouseover="wiiFocusSound();"

# SHOP BTN SOUNDS END


# wii shop sound guide START

#   snd.playBGM() : play the iconic Wii Shop Music pt1

# play the iconic Wii Shop Music 

#function initPageCommon()
#{
#    snd.playBGM()
 #   if (snd && "playBGM" in snd) {
#        snd.playBGM();
 #   }





#   snd.playSE(soundeffectid);  Play sound effects (list below)

 # soundeffectid: 2 =  hover sound

 # soundeffectid: 2 =  hover sound

 # soundeffectid: 3 =  click sound

 # soundeffectid: 4 =  back sound

 # soundeffectid: 5 =  choice select

 # soundeffectid: 6 =  max letters wii keyboard

 # soundeffectid: 7 =  Add Wii Points sound

# soundeffectid: 8 =  copy finish (download done) sound

# OTHER SFXS 

 # soundeffectid: 9 =  Small Mario Jump sound

 # soundeffectid: 10 =  Large Mario Jump sound

 # soundeffectid: 11 =  Fireball sound

 # soundeffectid: 12 =  Coin  sound

 # soundeffectid: 13 =  Jump (Hit Block) sound

 # soundeffectid: 14 =  Mario Swim sound

 # soundeffectid: 15 =  Wii downloading loading sound



# Examples on how they are used in a  page:

# playing the sound on page load

# <script>
#	snd.playSE(soundid);
#</script>

# playing the sound on page load


# playing the sound on a button

# onclick="snd.playSE(soundid);"

# playing the sound on a button


# ENABLE HOME MENU: shop.enableHRP();

# DISABLE HOME MENU: shop.disableHRP();

# WII SHOP GUIDES END


#Dakotath created the website and made the point system, Thom created the tables for data and implemented the point system on august 11th, 2024, I appreciate their work, I did the basic python templates and htmls, they made the backend work. Thank you two!

#Dakotath created the website and made the point system, Thom created the tables for data and implemented the point system on august 11th, 2024, I appreciate their work, I did the basic python templates and htmls, they made the backend work. Thank you two!

#Dakotath created the website and made the point system, Thom created the tables for data and implemented the point system on august 11th, 2024, I appreciate their work, I did the basic python templates and htmls, they made the backend work. Thank you two!

# START THE PYTHON/SHOP: python app.py
# START THE PYTHON/SHOP: python app.py
# START THE PYTHON/SHOP: python app.py


# actual shop stuffs 
import bcrypt
import pyotp
from flask import Flask, render_template, request, make_response, redirect
from flask_caching import Cache
import ssl
import requests
import mysql.connector
import no_connection_close
from nocache import nocache

 # please update from fin to dif text 

def ptsloading():
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    usr = request.cookies.get("usr")
    if bancheck(usr) == True:
        return redirect("/banned", code=302)
    else:
        pass
    select_sql = f"SELECT points FROM users WHERE username = '{usr}'"
    mycur.execute(select_sql)
    current_points = mycur.fetchone()[0]#type: ignore
    mysqlcon.close()
    return current_points
def updpts(ptns):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    usr = request.cookies.get("usr")
    if bancheck(usr) == True:
        return redirect("/banned", code=302)
    else:
        pass
    select_sql = f"SELECT points FROM users WHERE username = '{usr}'"
    mycur.execute(select_sql)
    current_points = mycur.fetchone()[0]#type: ignore
    ptnss = ""
    if ptns == 1:
        ptnss = 1000
    elif ptns == 2:
        ptnss = 2000
    elif ptns == 3:
        ptnss = 3000
    elif ptns == 5:
        ptnss = 5000
    updspts = current_points + ptnss
    updatesql = f"UPDATE users SET points = {updspts} WHERE username = '{usr}'"
    mycur.execute(updatesql)
    mysqlcon.commit()
def cardpoint(cardnb):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    usr = request.cookies.get("usr")
    if bancheck(usr) == True:
        return redirect("/banned", code=302)
    else:
        pass
    select_sql = f"SELECT amount FROM cards WHERE card = '{cardnb}'"
    mycur.execute(select_sql)
    try:
        points = mycur.fetchone()[0]#type: ignore
    except TypeError:
        return "failure"
    select_sql2 = f"SELECT points FROM users WHERE username = '{usr}'"
    mycur.execute(select_sql2)
    current_points = mycur.fetchone()[0]#type: ignore
    updspts = current_points + int(points)
    updatesql = f"UPDATE users SET points = {updspts} WHERE username = '{usr}'"
    mycur.execute(updatesql)
    mycur.execute(f"DELETE FROM cards WHERE card = {cardnb}")
    mysqlcon.commit()
    return "ok"
def accountdeletion(usr, pwd, usr2, pwd2):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    if usr2 == usr and pwd2 == pwd:
        getpwd = f"SELECT pass FROM users WHERE username = '{usr}'"
        mycur.execute(getpwd)
        pwdhashed = mycur.fetchone()[0]#type: ignore
        pwd = pwd.encode('utf-8')
        verify = bcrypt.checkpw(pwd, pwdhashed)
        if verify:
            delete_sql = f"DELETE FROM users WHERE username = '{usr}'"
            mycur.execute(delete_sql)
            mysqlcon.commit()
            return "ok"
        else:
            return "failed"
    else:
        return "failed"
def bancheck(usr):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    bancheck_sql = f"SELECT isBanned FROM users WHERE username = '{usr}'"
    mycur.execute(bancheck_sql)
    if usr == None:
        return False
    isbanned = mycur.fetchone()[0]#type: ignore
    if isbanned == 1 or isbanned == "1":
        return True
    else:
        return False
def adminchck(usr):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    admincheck_sql = f"SELECT isAdmin FROM users WHERE username = '{usr}'"
    mycur.execute(admincheck_sql)
    try:
        admin = mycur.fetchone()[0]#type: ignore
    except TypeError:
        return 0
    if admin == 1 or admin == "1":
        return 1
    else:
        return 0
def maintcheck():
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    maintcheck_sql = f"SELECT isup FROM WSCavailability"
    mycur.execute(maintcheck_sql)
    stat = mycur.fetchone()[0]#type: ignore
    if stat == 0 or stat == "0":
        return True
    else:
        return False
def news(newsid, title):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    if title == True:
        select_sql = f"SELECT title FROM news WHERE id = '{str(newsid)}'"
        mycur.execute(select_sql)
        titlenm = mycur.fetchone()[0]#type: ignore
        mysqlcon.close()
        return titlenm
    else:
        select_sql = f"SELECT text FROM news WHERE id = '{str(newsid)}'"
        mycur.execute(select_sql)
        text = mycur.fetchone()[0]#type: ignore
        mysqlcon.close()
        return text
def logind(usr, pwd):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    getpwd = f"SELECT pass FROM users WHERE username = '{usr}'"
    mycur.execute(getpwd)
    pwdhashed = mycur.fetchone()[0]#type: ignore
    pwdhashed = pwdhashed.encode('utf-8')
    pwd = pwd.encode('utf-8')
    verify = bcrypt.checkpw(pwd, pwdhashed)
    if verify == True:
        return True
    else:
        return False
def otpchek(usr):
    mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
    mycur = mysqlcon.cursor()
    getotp = f"SELECT hasOtp FROM users WHERE username = '{usr}'"
    mycur.execute(getotp)
    hasotp = mycur.fetchone()[0] # type: ignore
    if hasotp == 1 or hasotp == "1":
        return True
    else:
        return False

 # please update from fin to dif text 

app = Flask(__name__)

cache = Cache(app)



@app.route("/")
def mainroute():
 
   # return render_template("login.html")
   return redirect("/welcome", code=302)

@app.route("/welcome")
@nocache
def welcomorwelcombacktoreviive():
    return render_template("L_welcome.html")


@app.route("/linkclubacc")
@nocache
def linkclubacc1():
    return render_template("linkclubtendo.html")

@app.route("/loadlinkingclubacc")
@nocache
def fakeloadlinkacc():
    return render_template("loadclubtendoacc.html")

@app.route("/linkedclubacc")
@nocache
def linkedclubacc1():
    return render_template("linkedacc.html")

# unlink club acc

@app.route("/unlinkclubaccount")
@nocache
def unlinkclubacc():
    return render_template("unlinkclubaccount.html")

@app.route("/unlinkclubaccload")
@nocache
def fakeloadunlinkacc():
    return render_template("unlinkclubaccload.html")

@app.route("/unlinkedclubacc")
@nocache
def unlinkedclubacc():
    return render_template("unlinkedacc.html")

# unlink club acc



@app.route("/homepageAPR")
@nocache
def homepageshutdownedition():
    return render_template("W_03_shutdown.html",ptsNB=ptsloading())

@app.route("/hehehe")
def hea():
    return render_template("hehe.html")



# classic event jan 20 start

@app.route("/firstpageclassic")
@nocache
 # please update from fin to dif text 
def splashpgclassicevent():
    return render_template("W_01_Classic.html",finnewstitle1=news(1,True),finnewstitle2=news(2,True),finnewstitle3=news(3,True))

 # please update from fin to dif text 

    # ,ptsNB=ptsloading()

@app.route("/homepageclassic")
@nocache
def homepgclassicevent():
    return render_template("W_03_Classic.html",ptsNB=ptsloading())

@app.route("/homeclassic")
@nocache
def homepgaltshopguideclassic():
    return render_template("W_03_classic.html",ptsNB=ptsloading())

@app.route("/settingsclassic")
@nocache
def settingsclassicevent():
    return render_template("S_Classic.html",ptsNB=ptsloading())

@app.route("/removeaccountclassic")
def removeCLASSICreviiveaccount():
    return render_template("removeclassicacc.html")

@app.route("/wwclassic")
def wiiwareclassicpage():
    return render_template("B_classicww.html",ptsNB=ptsloading())

@app.route("/vcclassic")
def virtualconsoleclassicpage():
    return render_template("B_classicvc.html",ptsNB=ptsloading())

# classic event jan 20 end


# DSi Shop little funny easter egg

@app.route("/W_01.jsp")
def splashdsi():
    return render_template("dsisplash.jsp")


@app.route("/W_02.jsp")
def imptinfodsi():
    return render_template("dsinews.jsp")


@app.route("/W_03.jsp")
def homedsi():
    return render_template("dsimainmenu.jsp")

@app.route("/Settingsdsipg1")
def settingsdsi():
    return render_template("dsisettings.jsp")

@app.route("/dsiware")
def dsiware():
    return render_template("dsiware.jsp")

@app.route("/dsipointspg1")
def adddsipointspg1():
    return render_template("dsipoints.jsp")

@app.route("/guidedsi")
def shopguidedsi():
    return render_template("dsiguide.jsp")

@app.route("/dsimenu")
def returnhomemenudsi():
    return render_template("dsimenu.jsp")

# DSi Shop little funny easter egg




@app.route("/S_12")
def giftsettingz():
    return render_template("S_12.html")

@app.route("/giftselectfriend")
@nocache
def selectfriendforgift():
    return render_template("selectgiftmii.html",ptsNB=ptsloading())


@app.route("/giftingmsg")
@nocache
def writemessageforgiftandpickamii():
    return render_template("writemsggift.html")

@app.route("/sendinggift")
@nocache
def sendingthegift():
    return render_template("loadgift.html")


@app.route("/giftsent")
@nocache
def giftfinish():
    return render_template("giftsent.html",ptsNB=ptsloading())

# fake gifting end


@app.route("/giftingmsg")
@nocache
def writemessageforgiftandpickamii():
    return render_template("writemsggift.html")

@app.route("/sendinggift")
@nocache
def sendingthegift():
    return render_template("loadgift.html")


@app.route("/giftsent")
@nocache
def giftfinish():
    return render_template("giftsent.html")


# fake send gift end


@app.route("/connectingscreen")
def CONNECTINGPAGESERVER():
    return render_template("connectingplzwait.html")

# PLEASE set the redirect on connectingplzwait.html to /maint too!
@app.route("/maint")
def shopundermaintdeny():
    return render_template("maintenance.html")

# PLEASE set the redirect on connectingplzwait.html to /maint too!



@app.route("/indexx")
def index():
    usr = request.cookies.get("usr")
    return render_template("index.html",usr=usr)



# banned page 

@app.route("/banned")
def getoffreviiveshoplilbro():
    return render_template("banned.html")



# banned page


# downloading pages

@app.route("/vchome")
@nocache
def virtualconsolepg1():
    return render_template("B_01.html",ptsNB=ptsloading())

@app.route("/wwhome")
@nocache
def wiiwarepg1():
    return render_template("B_27.html",ptsNB=ptsloading())

@app.route("/channels")
@nocache
def wiichnlspg1():
    return render_template("B_04.html",ptsNB=ptsloading())


@app.route("/titleinfopage")
@nocache
def infoabttitle():
    return render_template("B_05.html",ptsNB=ptsloading())

@app.route("/B_06")
@nocache
def titleinfodesc():
    return render_template("B_06.html",ptsNB=ptsloading())

@app.route("/B_07")
@nocache
def titleratinginfo():
    return render_template("B_07.html",ptsNB=ptsloading())

@app.route("/B_08")
@nocache
def beforedownloadingnotethis():
    return render_template("B_08.html",ptsNB=ptsloading())

@app.route("/B_09")
@nocache
def comfirmtitledetailsbeforedownloading():
    return render_template("B_09.html",ptsNB=ptsloading())

@app.route("/B_10")
def DOWNLOADINGMARIOWOOHOO():
    return render_template("B_10.html")

# downloading pages



# fix errors with people who have parent ctrls, havent accepted user agreement, etc START

@app.route("/EulaCompatibleMode")
def wiiuseragreementbutcompatableiguess():
    return render_template("404.html")

@app.route("/Eula")
def wiiuseragreement():
    return render_template("404.html")


@app.route("/L_01.jsp")
def wiiuseragreementbutcompatableiguess2():
    return render_template("404.html")

@app.route("/L_03_UA_1.jsp")
def wiiuseragreement2():
    return render_template("404.html")

@app.route("/Log.jsp")
def WEIRDWIISHOPLOGX():
    return render_template("404.html")


@app.route("/L_04.jsp")
def ewparentalcontrols():
    return render_template("404.html")

# fix errors with people who have parent ctrls, havent accepted user agreement, etc END


# redirect people from download assistants to 404 - CHRISPLAYZBLOX/YT

@app.errorhandler(404)
def REDIRECT_FROMDOWNLOADASSISTANT_ORUNKNOWNURL(e):
    return render_template("404.html")

@app.errorhandler(500)
def REDIRECT_SERVERERROR(e):
    return render_template("500.html")

# redirect people from download assistants to 404 - CHRISPLAYZBLOX/YT


@app.route("/settingswiiTICKET")
def redeemawiiticket():
    return render_template("S_14.html")


@app.route("/REDEEMINGTHETICKET")
def redeemingawiiticket():
    return render_template("loadredeemticket.html")

@app.route("/REDEEMEDTHETICKET")
def redeemedawiiticket():
    return render_template("S_redeemedticket.html")


# ABOUT PAGES

@app.route("/about")
def aboutpg1():
    return render_template("about.html")

@app.route("/about2")
def aboutpg2():
    return render_template("about2.html")


@app.route("/about3")
def aboutpg3():
    return render_template("about3.html")

@app.route("/about4")
def aboutpg4():
    return render_template("about4.html")

@app.route("/about5")
def aboutpg5():
    return render_template("about5.html")


# ABOUT PAGES

@app.route("/404")
def errorfourohfour():
    return render_template("404.html")


@app.route("/homepage")
@nocache
def homepg():
    return render_template("W_03.html",ptsNB=ptsloading())

@app.route("/yougotagift")
@nocache
def userrecivedagift():
    return render_template("W_04.html")



@app.route("/home")
@nocache
def homepgaltshopguide():
    return render_template("W_03.html",ptsNB=ptsloading())


 # please update from fin to dif text 
@app.route("/firstpage")
@nocache
def firstpg():
    return render_template("W_01.html",finnewstitle1=news(1,True),finnewstitle2=news(2,True),finnewstitle3=news(3,True))
 # please update from fin to dif text 

@app.route("/shopguide")
def guideshopping():
    return render_template("/shoppingguide/startup.html")

@app.route("/startup.html")
def guideshoppingfixpagz():
    return render_template("/shoppingguide/startup.html")

@app.route("/shopguideclassic")
def guideshoppingclassic():
    return render_template("/shoppingguide/startup_classic.html")

@app.route("/startup_classic.html")
def guideshoppingclassicfix():
    return render_template("/shoppingguide/startup_classic.html")



@app.route("/ukv/page_01/page_01.html")
def guideshopping1():
    return render_template("/shoppingguide/ukv/page_01/page_01.html")


@app.route("/ukv/page_02/page_02.html")
def guideshopping2():
    return render_template("/shoppingguide/ukv/page_02/page_02.html")



@app.route("/ukv/page_03/page_03.html")
def guideshopping3():
    return render_template("/shoppingguide/ukv/page_03/page_03.html")


@app.route("/ukv/page_04/page_04.html")
def guideshopping4():
    return render_template("/shoppingguide/ukv/page_04/page_04.html")



@app.route("/ukv/page_05/page_05.html")
def guideshopping5():
    return render_template("/shoppingguide/ukv/page_05/page_05.html")



@app.route("/ukv/page_06/page_06.html")
def guideshopping6():
    return render_template("/shoppingguide/ukv/page_06/page_06.html")



@app.route("/ukv/page_07/page_07.html")
def guideshopping7():
    return render_template("/shoppingguide/ukv/page_07/page_07.html")


@app.route("/ukv/page_08/page_08.html")
def guideshopping8():
    return render_template("/shoppingguide/ukv/page_08/page_08.html")


@app.route("/ukv/page_09/page_09.html")
def guideshopping9():
    return render_template("/shoppingguide/ukv/page_09/page_09.html")

@app.route("/ukv/page_10/page_10.html")
def guideshopping10():
    return render_template("/shoppingguide/ukv/page_10/page_10.html")

@app.route("/ukv/page_11/page_11.html")
def guideshopping11():
    return render_template("/shoppingguide/ukv/page_11/page_11.html")

@app.route("/ukv/page_12/page_12.html")
def guideshopping12():
    return render_template("/shoppingguide/ukv/page_12/page_12.html")

# dont mess with news 1 its a welcome msg. 

@app.route("/news01")
@nocache
def news1():
    return render_template("news1.html")



@app.route("/news1txt")
@nocache
def news1text():
    return render_template("news1txt.html")

# dont mess with news 1 its a welcome msg. 

 # please update from fin to dif text 
@app.route("/news02")
@nocache
def news2():
    return render_template("news2.html",finnewstitle1=news(1,True))
 # please update from fin to dif text 

 # please update from fin to dif text 
@app.route("/news2txt")
@nocache
def news2text():
    return render_template("news2txt.html",newsColor="#000000",news=news(2,False))
 # please update from fin to dif text 


 # please update from fin to dif text 
@app.route("/news03")
@nocache
def news3():
    return render_template("news3.html",finnewstitle2=news(2,True))
 # please update from fin to dif text 

 # please update from fin to dif text 
@app.route("/news3txt")
@nocache
def news3text():
    return render_template("news3txt.html",news=news(2, False))

 # please update from fin to dif text 

 # please update from fin to dif text 
@app.route("/news04")
@nocache
def news4():
    return render_template("news4.html",finnewstitle3=news(3,True))
 # please update from fin to dif text 

 # please update from fin to dif text 
@app.route("/news4txt")
@nocache
def news4text():
    return render_template("news4txt.html",news=news(3, False))
 # please update from fin to dif text 

	

@app.route("/Recommended_Titles_Fake.html")
def recom1():
    return render_template("Recommended_Titles_Fake.html")



@app.route("/Recommended_Titles_Fake_2.html")
def recom2():
    return render_template("Recommended_Titles_Fake_2.html")


@app.route("/AccountActivity")
def AA():
    return render_template("AccountActivity.html")


@app.route("/TitlesYouDownloaded")
def TYD():
    return render_template("TYD.html")


@app.route("/settings")
def setandfeat():
    return render_template("S_01.html",ptsNB=ptsloading())

@app.route("/Settings")
def setandfeatCAPTALIZEDFIX():
    return render_template("S_01.html",ptsNB=ptsloading())

# connection ambassador start

@app.route("/connectambassadormainpage")
def connectambaspage1():
    return render_template("S_16.html",ptsNB=ptsloading())


# helper's page start

@app.route("/connectambassadorhelper")
def connectambassadorpersonwhohelpedonmainpg():
    return render_template("S_helper.html",ptsNB=ptsloading())

@app.route("/connectambassadorstatuscheck")
def connectambassadorcheckstatus():
    return render_template("S_checkfcstatus.html")



# helper's page end


# person who was helped page start

@app.route("/connectambassadorhelped")
def connectambassadorpersonwhogothelpedonmainpg():
    return render_template("S_helped.html",ptsNB=ptsloading())



# person who was helped page end

    
@app.route("/givenptsscreen")
def CAPOINTSADDEDSUCESS():
    return render_template("S_ptsgivenhelperandhelped.html")



# connection ambassador end






@app.route("/removeaccount")
def removereviiveacc():
    return render_template("S_09.html",ptsNB=ptsloading())

@app.route("/removedaccount", methods=["POST"])#type: ignore
def removedreviiveacc():
    if request.method == "POST":
        usernm = request.form["uname"]
        passwd = request.form["psw"]
        usr1 = request.cookies.get("usr")
        pwd1 = request.cookies.get("pwd")
        if bancheck(usernm) == True:
            return redirect("/banned", code=302)
        else:
            pass
        status = accountdeletion(usernm,passwd,usr1,pwd1)
        if status == "failed":
            info = """<p id=\"infoText" style=\"color:red;\"  class="infoText1">Incorrect Username or Password</p>"""
            return render_template("S_09.html",ptsNB=ptsloading(),infoColor="#135e9b",infoText=info)
        elif status == "ok":
            return render_template("S_10.html")
    else:
        return "failure"







# SEARCH BY ____ WIIWARE OR VC START

@app.route("/VCSBC")
def vcsearchbycat():
    return render_template("search_VC_by_catagory.html",ptsNB=ptsloading())

@app.route("/VCSBS")
def vcsearchbysys():
    return render_template("search_VC_by_system.html",ptsNB=ptsloading())

@app.route("/VCSBP")
def vcsearchbypublish():
    return render_template("search_VC_by_publish.html",ptsNB=ptsloading())

@app.route("/VCSBG")
def vcsearchbygenre():
    return render_template("search_VC_by_genre.html",ptsNB=ptsloading())

@app.route("/WWSBP")
def wwsearchbypublish():
    return render_template("search_WW_by_publish.html",ptsNB=ptsloading())

@app.route("/WWSBG")
def wwsearchbygenre():
    return render_template("search_WW_by_genre.html",ptsNB=ptsloading())


# SEARCH BY ____ WIIWARE OR VC END









       # LOGIN SYSTEM START 
@app.route("/adminchck/<usr>")
def adminchecking(usr):
    admin = adminchck(usr)
    if admin == 1:
        return redirect("/indexx", code=302)
    else:
        status = maintcheck()
        if status == True:
            return redirect("/maint", code=302)
        else:
            return redirect("/connectingscreen",code=302)
@app.route("/otpcheck/<usr>")#type: ignore
def optcheck(usr):
    otp = otpchek(usr)
    if otp == True:
        return redirect("/otpcode", code=302)
    else:
        return redirect(f"/adminchck/{usr}", code=302)
@app.route("/login", methods=["GET","POST"]) # type: ignore
def login():
    if request.method == "GET":
        usr = request.cookies.get("usr")
        pwd = request.cookies.get("pwd")
        if (usr is None or usr == "") or (pwd is None or pwd == ""):
            return render_template("login.html")
        else:
            if bancheck(usr) == True:
                return redirect("/banned", code=302)
            else:
                pass
            log = logind(usr,pwd)
            if log == True:
                yay = make_response(redirect(f"/otpcheck/{usr}", code=302))
                yay.set_cookie("usr", usr)
                yay.set_cookie("pwd", pwd)
                return yay
            else:
                info = """<p id=\"infoText" style=\"color:red;\"  class="infoText1">Incorrect Username or Password</p>"""
                return render_template("login.html",infoColor="#135e9b",infoText=info)
    elif request.method == "POST":
        try:
            usr = request.form["loginName"]
            pwd = request.form["password"]
        except TypeError:
            info = """<p id=\"infoText" style=\"color:red;\"  class="infoText1">Username or Password Cannot be empty</p>"""
            return render_template("login.html",infoColor="#135e9b",infoText=info)
        if (usr is not None or usr != "") or (pwd is not None or pwd != ""):
            log = logind(usr,pwd)
            if log == True:
                yay = make_response(redirect(f"/otpcheck/{usr}", code=302))
                yay.set_cookie("usr", usr)
                yay.set_cookie("pwd", pwd)
                return yay
            else:
                info = """<p id=\"infoText" style=\"color:red;\"  class="infoText1">Incorrect Username or Password</p>"""
                return render_template("login.html",infoColor="#135e9b",infoText=info)
        else:
            info = """<p id=\"infoText" style=\"color:red;\"  class="infoText1">Username or Password Cannot be empty</p>"""
            return render_template("login.html",infoColor="#135e9b",infoText=info)
    else:
        return "NOT ALLOWED"
@app.route("/otpcode", methods=["GET","POST"]) # type: ignore
def otpcode():
    if request.method == "GET":
        return render_template("twosteplogin.html")
    elif request.method == "POST":
        usr = request.cookies.get("usr")
        otp = request.form["otp"]
        mysqlcon = mysql.connector.connect(user="rvshop_2024",password="4BlAnC72&",host="usest1.netro.host",database="rvshop_2024dev",port="10086")
        mycur = mysqlcon.cursor()
        getotp = f"SELECT otpSecret FROM users WHERE username = '{usr}'"
        mycur.execute(getotp)
        otpsecret = mycur.fetchone()[0] # type: ignore
        totp = pyotp.TOTP(otpsecret)
        if totp.verify(otp) == True:
            return redirect(f"/adminchck/{usr}",code=302)
        else:
            return redirect("/otpcode", code=302)

        # LOGIN SYSTEM END 


# pts system start


@app.route("/addpoints")
@nocache
def addwiiptsbtn():
    return render_template("P_01.html",ptsNB=ptsloading())



@app.route("/choosecardaddingpts")
def pickaFAKEcredit():
    return render_template("P_07.html")



@app.route("/addpts")
def addwiiptschoose():
    return render_template("P_06.html")


@app.route("/pointscard")
def addptsusingcardoption():
    return render_template("P_02.html",ptsNB=ptsloading())


@app.route("/submitpointcard",methods=["POST"])
def submiteddacard():
    card = request.form.get("cardNumber")
    succes = cardpoint(card)
    if succes == "failure":
        return redirect("/pointscardfailed", code=302)
    else:
        return render_template("P_comfirmcard.html",ptsNB=ptsloading())

@app.route("/pointscomfirmcard")
def sureuwannaadd():
    return render_template("P_comfirmcard.html",ptsNB=ptsloading())


# fake loading screens for accuracy 

@app.route("/loadingcardpoints")
@nocache
def pointscardwowiezowie():
    return render_template("P_loadingptcard.html")

@app.route("/loadingnormalpoints")
@nocache
def pointsnormalwowiezowie():
    return render_template("P_loadingcard.html")
	
# fake loading screens for accuracy 


@app.route("/pointscardfailed")
def addptsusingcardoptionINCORRECT():
    return render_template("P_failedcard.html")


@app.route("/chooseamountofpts")
def choosepointsamount():
    return render_template("P_06.html")

@app.route("/finsptsysteminfo/<pts>")
def beginadding(pts):
    updpts(int(pts))
    return render_template("P_08.html")


@app.route("/finsptsystemadding")
def comfirmchoice():
    return render_template("P_12.html",ptsNB=ptsloading())


@app.route("/addpointsusingthefinptsystem")
def addedpts():
    return render_template("P_15.html",ptsNB=ptsloading())

@app.route("/addedpointscarddone")
def addedptsfromcard():
    return render_template("P_04.html",ptsNB=ptsloading())



# pts system end



# START THE PYTHON/SHOP: python app.py

# START THE PYTHON/SHOP: python app.py

# START THE PYTHON/SHOP: python app.py

if __name__ == '__main__':
    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
    context.set_ciphers('ALL:@SECLEVEL=0')
    context.load_cert_chain('ssl/server.pem', 'ssl/server.key')
    app.run(host="0.0.0.0", port=443, debug=True, ssl_context=context)


# actual shop stuffs 
