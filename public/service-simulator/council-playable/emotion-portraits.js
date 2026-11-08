// Expression choices illustrate the scenario's authored feelings, rather than inferring emotion.
const expressions = {
  'Concerned':'concerned', 'Heard':'heard', 'Uncertain':'uncertain',
  'Reassured':'reassured', 'Relieved':'relieved', 'Unsure':'uncertain',
  'Frustrated':'frustrated', 'Hopes for clarity':'hopeful',
  'Outcome untested':'uncertain', 'Uncertain, then heard':'heard', 'Informed':'informed'
};
export const emotionPositions = Object.freeze({
  concerned:'0% 0%', heard:'33.333333% 0%', uncertain:'66.666667% 0%', reassured:'100% 0%',
  relieved:'0% 100%', frustrated:'33.333333% 100%', hopeful:'66.666667% 100%', informed:'100% 100%'
});
export function expressionForFeeling(feeling){return expressions[feeling] || 'uncertain';}
