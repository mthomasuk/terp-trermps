//
//  CardsView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 14/06/2021.
//

import SwiftUI

struct CardsView: View {
    @EnvironmentObject var ws: WebsocketController

    var isLeader: Bool

    var roundId: String
    var selectedAttribute: String
    var cards: [CardModel?]
    
    @State var selectedCard: CardModel?
    @State var droppedCard: CardModel?
    
    var canPlayHand: Bool {
        return isLeader || selectedAttribute != "" || ws.atttributeSelected != ""
    }
    
    var filteredCards: [CardModel?] {
        if selectedCard != nil || droppedCard != nil {
            let filter = selectedCard != nil ? selectedCard!.id : droppedCard!.id
            return cards.filter { $0!.id != filter }
        }
        return cards
    }
    
    func onSelect(card: CardModel) -> Void {
        if canPlayHand {
            selectedCard = card
        }
    }
    
    var body: some View {
        ZStack(alignment: .center) {
            ForEach(filteredCards.indices, id: \.self) { index in
                CardView(
                    card: filteredCards[index]!,
                    index: index,
                    selectedAttribute: selectedAttribute
                )
            }
        }.offset(x: 40)
    }
}
