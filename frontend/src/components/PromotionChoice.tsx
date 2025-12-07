import { type PieceSymbol } from "chess.js"

export const PromotionChoice = ({ onSelect }: { onSelect: (promotion: PieceSymbol) => void }) => {
    const promotions: PieceSymbol[] = ['q', 'r', 'b', 'n'];
    return (
        <div
            className="promotion-menu"
            onClick={(e) => e.stopPropagation()}
        >
            {promotions.map((promo) => (
                <img
                    key={promo}
                    className="promotion-piece"
                    src={`/pieces/w${promo}.svg`}
                    alt=""
                    onClick={() => onSelect(promo)}
                />
            ))}
        </div>
    );
}