#html5 合約橋#

###版本    **尚未完成 (持續更新中)**

### Overview
這是一個將原本es5編程升級成用es6實作的專案,基於在canvas上的開發,除了後端必要npm套件外,前端的開發沒有使用任何javascript 涵式庫,前後溝通通道透過 socket . 由於需要server的安裝,目前這個倉庫(repository)只有client的簡易demo.

遊戲中王牌敦線的競叫(auction)在es6實作中打算改以Web rtc來實作,透過網路玩橋牌,又可與玩家朋友面對面互相競譙這一定會很有趣.


___
第一步安裝必要東西,
```
   npm install
```
再來於安裝目錄下(client)下執行
```
   gulp watch
```

最後   ```  http://localhost:8081/build/  ```

___

###洗牌
![GitHub Logo](https://raw.githubusercontent.com/moszorn/server/master/assets/0.png)
###競叫
![GitHub Logo](https://raw.githubusercontent.com/moszorn/server/master/assets/1.png)
###
![GitHub Logo](https://raw.githubusercontent.com/moszorn/server/master/assets/3.png)