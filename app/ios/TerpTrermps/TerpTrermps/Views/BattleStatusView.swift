//
//  BattleStatusView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 14/06/2021.
//

import SwiftUI

struct BattleStatusView: View {
    @EnvironmentObject var ws: WebsocketController

    var isLeader: Bool
    var battleInProgress: Bool
    var selectedAttribute: String
    
    var status: String {
        var str = "Waiting for the battle to start"
        
        if battleInProgress {
            str = "Your enemy is plotting something..."
        }
        
        if isLeader {
            str = "Choose your card & attribute!"
        }
        
        if self.ws.atttributeSelected != "" {
            str = "Attribute is \(self.ws.atttributeSelected.replacingOccurrences(of: "_", with: " "))"
        }
        
        if selectedAttribute != "" {
            str = "Attribute is \(selectedAttribute.replacingOccurrences(of: "_", with: " "))"
        }

        return str
    }
    
    var body: some View {
        VStack(alignment: .center) {
            Text(status).font(.footnote)
        }
    }
}
