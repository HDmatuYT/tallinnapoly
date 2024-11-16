async function fetchBazaarPrices() {
    try {
        const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
        const data = await response.json();

        if (!data.success) {
            throw new Error('kle su bazaar ei pr täna, ole pai ja proovi uuesti');
        }

        // hinnad eep ja br jaoks
        const enchantedEnderPearl = data.products['ENCHANTED_ENDER_PEARL'].quick_status.sellPrice;
        const blazeRod = data.products['BLAZE_ROD'].quick_status.sellPrice;

        return {
            enchantedEnderPearl,
            blazeRod
        };
    } catch (error) {
        console.error('Error fetching Bazaar prices:', error);
        return null;
    }
}

async function calculateMaterials() {
    const quantity = parseFloat(document.getElementById("quantity").value);
    const coinsAvailable = parseFloat(document.getElementById("coinsAvailable").value);

    if (quantity < 1 || isNaN(quantity) || coinsAvailable < 0 || isNaN(coinsAvailable)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    const bazaarPrices = await fetchBazaarPrices();
    if (!bazaarPrices) {
        alert("Failed to fetch Bazaar prices. Please try again later.");
        return;
    }

    const enderPearlPrice = bazaarPrices.enchantedEnderPearl;
    const blazeRodPrice = bazaarPrices.blazeRod;

    const enchantedEnderPearlsPerEye = 16;
    const blazeRodsPerEye = 32;

    const totalEnchantedEnderPearls = enchantedEnderPearlsPerEye * quantity;
    const totalBlazeRods = blazeRodsPerEye * quantity;

    const totalCostEnchantedEnderPearls = totalEnchantedEnderPearls * enderPearlPrice;
    const totalCostBlazeRods = totalBlazeRods * blazeRodPrice;
    const totalCost = totalCostEnchantedEnderPearls + totalCostBlazeRods;

    const income = coinsAvailable;
    const profit = income - totalCost;

    document.getElementById("result").innerHTML = `
        <p><strong>Total Enchanted Ender Pearls:</strong> ${totalEnchantedEnderPearls}</p>
        <p><strong>Total Blaze Rods:</strong> ${totalBlazeRods}</p>
        <p><strong>Total Cost for Enchanted Ender Pearls:</strong> ${totalCostEnchantedEnderPearls.toLocaleString()} coins</p>
        <p><strong>Total Cost for Blaze Rods:</strong> ${totalCostBlazeRods.toLocaleString()} coins</p>
        <p><strong>Total Cost for all materials:</strong> ${totalCost.toLocaleString()} coins</p>
        <p><strong>Income:</strong> ${income.toLocaleString()} coins</p>
        <p><strong>Profit/Loss:</strong> 
            <span style="color: ${profit >= 0 ? 'green' : 'red'};">${profit.toLocaleString()} coins</span>
        </p>
    `;

    const data = {
        income,
        spent: totalCost,
        profit
    };

    fetch('https://kool.krister.ee/chat/mathias_skyblock_kalkulaator', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log("gud");
        } else {
            console.error(`bäääd. Status: ${response.status}, Message: ${response.statusText}`);
        }
    })
    .catch(error => console.error("Error:", error));
}
