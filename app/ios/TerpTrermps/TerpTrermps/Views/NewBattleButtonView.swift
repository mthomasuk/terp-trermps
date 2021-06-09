//
//  NewBattleButtonView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct NewBattleButton: View {
    @State var proceedToView: Bool = false
    @State var battleId: String = ""
    
    var startNewBattle: () -> Void {
        return {
            createBattle(completion: {(result: String?, error: Error?) -> () in
                if error != nil {
                    print(error!)
                } else {
                    battleId = result!
                    proceedToView = true
                }
            })
        }
    }

    var body: some View {
        NavigationLink(destination: BattleView(battleId: battleId), isActive: $proceedToView) {}
        Button(
            action: startNewBattle,
            label: {
                Text("Start New Battle")
                    .font(.body)
                    .padding(.vertical, 8)
                    .padding(.horizontal, 14)
                    .foregroundColor(Color.black)
                    .cornerRadius(15)
                    .background(
                        Color(red: 355/255, green: 215/255, blue: 0/255)
                            .shadow(color: Color.black, radius: 0, x: 3.0, y: 3.0)
                    )
            }
        ).padding(.vertical, 10)
    }
}