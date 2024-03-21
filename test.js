/** @param {NS} ns */
export async function main(ns) {
    let depth = ns.args[0];
    const hackScript = "hack1-0.js";
    const programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
    let ports = 0;
    let target = "n00dles";
    let money = 0;
    let servers = ["home"];
    let i = 0;
    let once = true;
    let emptyServers = ["n00dles", "foodnstuff"];
    let hackingContract = [];
    while (true) {
      i = 0;
      ports = 0;
      for (const element of programs) {
        if (ns.fileExists(element)) {
          ports++;
        } else {
          break;
        }
      }
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
      ns.tprint(depth + hackingContract);
      servers.forEach((element) => {
        if ((ns.getHackingLevel() > (ns.getServerRequiredHackingLevel(element) * 2)) && (ns.getServerMaxMoney(element) > money)) {
          target = element;
          money = ns.getServerMaxMoney(element);
        }
      })
      servers.forEach((element) => {
        if (ns.hasRootAccess(element) && !ns.isRunning(hackScript, element, target)) {
          ns.killall(element);
          let threads = Math.floor(ns.getServerMaxRam(element) / 2.4);
          if (threads > 0) {
            ns.scp(hackScript, element);
            ns.exec(hackScript, element, threads, target);
          }
        }
        if (!ns.hasRootAccess(element) && (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(element)) && (ns.getServerNumPortsRequired(element) <= ports)) {
          if (ports >= 1) {
            ns.brutessh(element);
            if (ports >= 2) {
              ns.ftpcrack(element);
              if (ports >= 3) {
                ns.relaysmtp(element);
                if (ports >= 4) {
                  ns.httpworm(element);
                  if (ports == 5) {
                    ns.sqlinject(element);
                  }
                }
              }
            }
          }
          ns.nuke(element);
          /*try {
            ns.scp(ns.ls(element), "home", element);
          } catch (error) {
            ns.print(element + error);
            ns.tprint(element + error);
          }*/
          let threads = Math.floor(ns.getServerMaxRam(element) / 2.4);
          if (threads > 0) {
            ns.scp(hackScript, element);
            ns.exec(hackScript, element, threads, target);
          }
        }
        if ((ns.getServerMaxMoney(element) < money) && ns.hasRootAccess(element) && !emptyServers.includes(element) && (ns.getServerUsedRam("home") < (ns.getServerMaxRam("home") * 0.1))) {
          let threads = Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) / 1.7);
          emptyServers.push(element);
          ns.run("emptyServer.js", threads, element);
          ns.tprint(emptyServers + " zijn leeg")
        }
        if (ns.hasRootAccess(element) && !hackingContract.includes(element)) {
          try {
            ns.scp(ns.ls(element), "home", element);
          } catch (error) {
            hackingContract.push(element);
          }
        }
      });
      await ns.sleep(600000);
      depth++;
    }
  }