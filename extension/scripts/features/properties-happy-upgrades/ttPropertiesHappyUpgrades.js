"use strict";

(async () => {
	if (!getPageStatus().access) return;
	const feature = featureManager.registerFeature(
		"Property Staff Upgrades Happiness Values",
		"property",
		() => settings.pages.property.happyUpgrades,
        initialiseListener,
		appendHappinessValues,
        cleanUpHappinessValues,
		{
			storage: ["settings.pages.property.happyUpgrades"],
		},
		null
	);

    upgrades = {
        "None": 0,
        "Maid service" : 50,
        "2x Maid service" : 75,
        "3x Maid service" : 85,
        "5x Maid service" : 100,
        "Butler service": 75,
        "2x Butler service": 100,
        "3x Butler service": 125,
        "Guard": 100,
        "2x Guards": 100,
        "3x Guards": 100,
        "5x Guards": 100,
        "10x Guards": 100,
        "Doctor": 25,
        "Pilot": 50
    }

    const menuElements = document.getElementsByClassName('ui-selectmenu-menu');
    const totalCostDiv = document.getElementsByClassName('confirm-msg p10');

    function initialiseListener() {
		new MutationObserver(() => {
			if (feature.enabled()) appendHappinessValues();
		}).observe(document.find("ui-selectmenu-menu'"), { childList: true });
	}
    function addTotalToButton(){
        document.getElementsByClassName('update btn-wrap silver')[0].children[0].children[0].addEventListener("click", appendHappinessTotal)
    }

	function appendHappinessValues() {
        for (const menuElement of menuElements) {
            const menuElementOptions = menuElement.children[0].children
            for (const options of menuElementOptions) {
                let upgrade = options.innerText.split(" (")[0]
                options.innerText += ` ${staffUpgrades[upgrade]}H`
            }
          }
        addTotalToButton();
    }
    function getHappinessTotal(){
        let happinessTotal = 0;
        for (const menuElement of menuElements) {
            const menuElementOptions = menuElement.children[0].children
            for (const options of menuElementOptions) {
                if (options.className == "ui-selectmenu-item-selected") {
                    let upgrade = options.innerText.split(" (")[0]
                    happinessTotal = happinessTotal + staffUpgrades[upgrade]
                    console.log(`Adding happiness from upgrades to total! Total: ${happinessTotal}`)
                }
            }
        }
        return happinessTotal;
    }
    function appendHappinessTotal() {
        requireElement(".confirm-msg .p10").then(() => {
            let happinessTotal = getHappinessTotal();
            if (document.getElementsByClassName('tt-total-happiness').length == 0){
                happinessPElement = document.createElement('p');
                happinessPElement.innerText = `Total Happiness from Staff Upgrades: ${happinessTotal}`;
                happinessPElement.className = 'tt-total-happiness';
                totalCostDiv[0].appendChild(happinessPElement);
        } else {
                document.getElementsByClassName('tt-total-happiness')[0].innerText = `Total Happiness from Staff Upgrades: ${happinessTotal}`;
        }
        })
    }
    function cleanUpHappinessValues() {
        document.findAll(".tt-modified").forEach((x) => x.remove());
        document.findAll(".tt-total-happiness").forEach((x) => x.remove());
    }
		
})();