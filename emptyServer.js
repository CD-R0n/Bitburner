/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    ns.hack(target);
  }