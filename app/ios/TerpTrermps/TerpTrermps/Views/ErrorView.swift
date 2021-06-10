//
//  ErrorView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import SwiftUI

struct ErrorView: View {
    var error: Error
    
    var body: some View {
        VStack(alignment: .center) {
            Text("Something went horribly wrong")
            Text("\(error.localizedDescription)")
        }
    }
}
