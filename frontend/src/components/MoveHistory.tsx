export const MoveHistory = ({ moves }: { moves: string[] }) => {
    const pairs: [string, string | undefined][] = [];
    for (let i = 0; i < moves.length; i += 2) {
        pairs.push([moves[i], moves[i + 1]]);
    }

    return (
        <div className="move-history">
            <h2>Moves</h2>
            <ol className="move-history-list">
                {pairs.map(([white, black], index) => (
                    <li key={index} className="move-history-row">
                        <span className="move-number">{index + 1}.</span>
                        <span className="move-white">{white}</span>
                        <span className="move-black">{black ?? ""}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
};
