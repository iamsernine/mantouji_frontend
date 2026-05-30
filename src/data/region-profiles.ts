import type { MoroccoMapCode } from "@/data/morocco-admin-regions";

export type RegionProfile = {
  mapCode: MoroccoMapCode;
  intro: string;
};

export const REGION_PROFILES: Record<MoroccoMapCode, RegionProfile> = {
  MA01: {
    mapCode: "MA01",
    intro:
      "Entre le détroit et les crêtes du Rif, cette région mêle côtes atlantique et méditerranéenne, oliviers en terrasse et villages accrochés aux flancs des montagnes. C'est un passage obligé pour le thé du Rif, l'huile des plaines de Larache et les conserves de poisson des ports du nord.",
  },
  MA02: {
    mapCode: "MA02",
    intro:
      "Le Oriental, c'est la palmeraie de Figuig, les pistes du Beni Snassen et les dattes qu'on trie à la main en fin d'automne. Les oasis et les contreforts du Rif oriental nourrissent un petit commerce local autour des dattes, du miel et des amandes.",
  },
  MA03: {
    mapCode: "MA03",
    intro:
      "Fès-Meknès reste le cœur des semoules, des légumineuses et des huiles qui partent vers les souks du pays. Entre Saïss, Ifrane et les collines de Meknès, les coopératives travaillent surtout le couscous, le cumin, les olives et les fromages de montagne.",
  },
  MA04: {
    mapCode: "MA04",
    intro:
      "La plaine du Gharb et la côte atlantique entre Rabat et Kénitra produisent une grande part des agrumes, des céréales et du vin de table marocain. C'est aussi une zone de légumes de plein champ et de riz dans les zones humides près des estuaires.",
  },
  MA05: {
    mapCode: "MA05",
    intro:
      "Au pied du Moyen Atlas, Béni Mellal-Khénifra vit au rythme des oliviers du Tadla, des oranges de Kasba Tadla et des troupeaux qui montent en estive. Les cooperatives de la zone mettent surtout en avant l'huile, les agrumes et le miel des forêts de cèdre.",
  },
  MA06: {
    mapCode: "MA06",
    intro:
      "Casablanca-Settat concentre une partie importante de la production céréalière nationale, avec aussi des élevages laitiers et des maraîchages le long de la côte. El Jadida et la zone de Settat restent connues pour les légumes, le lait et les produits transformés destinés aux grandes villes.",
  },
  MA07: {
    mapCode: "MA07",
    intro:
      "De l'arganier du Souss aux safrans de Taliouine, Marrakech-Safi réunit montagne, plaines et littoral. C'est ici qu'on presse l'huile d'argan, qu'on sèche les olives de l'Haouz et qu'on prépare les confitures de figue de l'Atlas.",
  },
  MA08: {
    mapCode: "MA08",
    intro:
      "Drâa-Tafilalet, c'est la vallée des dattes, les kasbahs en pisé et les roses de Kelaat M'Gouna qu'on distille en fin de printemps. Entre Errachidia et Zagora, les palmeraies et les jardins irrigués produisent dattes, amandes, safran local et miel de euphorbe.",
  },
  MA09: {
    mapCode: "MA09",
    intro:
      "Le Souss autour d'Agadir et la côte atlantique forment l'un des grands bassins agricoles du pays : agrumes, tomates sous serre, mais aussi arganiers et amandiers sur les contreforts. Les coopératives y valorisent surtout l'argan, les agrumes et les légumes exportés.",
  },
  MA10: {
    mapCode: "MA10",
    intro:
      "Guelmim-Oued Noun marque la transition entre l'Atlas et le Sahara : pâturages, acacias, élevage camelin et pêche artisanale sur la côte. On y trouve du miel d'acacia, de la viande séchée traditionnelle et des produits liés au nomadisme.",
  },
  MA11: {
    mapCode: "MA11",
    intro:
      "Laâyoune-Sakia El Hamra s'étend entre désert et Atlantique. La pêche (sardines, céphalopodes) structure une partie de l'économie locale, tandis que les oasis produisent légumes de contre-saison et dattes dans les zones irriguées.",
  },
  MA12: {
    mapCode: "MA12",
    intro:
      "Dakhla-Oued Ed-Dahab, au bout de la côte atlantique, est connue pour ses lagunes, ses huîtres et sa production maraîchère sous abri. Le climat doux permet tomates, melons et plants aromatiques qu'on expédie vers le nord du pays.",
  },
};

export function getRegionProfile(mapCode: MoroccoMapCode): RegionProfile {
  return REGION_PROFILES[mapCode];
}
