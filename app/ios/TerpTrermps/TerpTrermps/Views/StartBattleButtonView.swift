//
//  StartBattleButtonView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 14/06/2021.
//

import SwiftUI

struct StartBattleButton: View {
    var battleId: String
    var refetch: () -> ()
    
    var beginBattle: () -> Void {
        return {
            startBattle(battleId: battleId, completion: {(error: Error?) -> () in
                if error != nil {
                    print(error!.localizedDescription)
                } else {
                    refetch()
                }
            })
        }
    }

    var body: some View {
        Button(
            action: beginBattle,
            label: {
                Text("⚔️ Begin battle ⚔️")
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
