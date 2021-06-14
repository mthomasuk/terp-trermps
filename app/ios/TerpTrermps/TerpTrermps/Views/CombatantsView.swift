//
//  CombatantsView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 14/06/2021.
//

import SwiftUI

struct CombatantsView: View {
    var combatants: [String]
    
    var body: some View {
        ForEach(combatants.indices, id: \.self) { index in
            Text(combatants[index])
                .font(.largeTitle)
                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                .multilineTextAlignment(.center)
            if index != (combatants.count - 1) {
                Text("VS")
                    .font(.headline)
                    .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                    .padding(.vertical, 10)
            }
        }
    }
}
