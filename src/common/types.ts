export type difficultyType = "Easy" | "Medium" | "Hard" | "Insane";

export type gameStatsType = {
  id: string;
  time: number;
  date: moment.Moment;
  mode: "Mistakes" | "Standard";
  won: boolean;
  difficulty: string;
};

export type colorModeType = "dark" | "light" | null;
