/** @param {NS} ns */
export async function main(ns) {
    let depth = ns.args[0];
    let servers = ["home"];
    let once = true;
    let i = 0;
    for (const element of servers) {
      let scanResult = ns.scan(element);
      scanResult.forEach((element => {
        if (!servers.includes(element) && !(element == "home")) {
          servers.push(element);
        }
      }))
      if (once) {
        servers.shift();
        once = false;
      }
      i++;
      if (i >= depth) {
        break;
      }
    }
    ns.tprint(servers);
    let target;
    let money = 0;
    servers.forEach(element => {
      if ((ns.getServerMaxMoney(element) > money) && (ns.getServerRequiredHackingLevel(element) < ns.getHackingLevel())) {
        target = element;
        money = ns.getServerMaxMoney(element);
      }
    })
    ns.tprint(target);
  }