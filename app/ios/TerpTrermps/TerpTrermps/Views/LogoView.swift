//
//  LogoView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct Logo: View {
    var body: some View {
        VStack(alignment: .leading) {
            ZStack {
                Text("SUPER").kerning(28).font(.system(size: 22)).italic().foregroundColor(.black).fontWeight(.heavy).offset(x: 2, y: 2)
                Text("SUPER").kerning(28).font(.system(size: 22)).italic().foregroundColor(.white).fontWeight(.heavy).shadow(color: .black, radius: 1)
            }
            ZStack {
                Text("TERP").font(.system(size: 80)).italic().foregroundColor(.black).fontWeight(.heavy).offset(x: 4, y: 0).padding(.vertical, -20)
                Text("TERP").font(.system(size: 80)).italic().foregroundColor(.white).fontWeight(.heavy).offset(x: 2, y: 0).padding(.vertical, -20)
                Text("TERP").font(.system(size: 80)).italic().foregroundColor(Color(red: 215/255, green: 43/255, blue: 43/255)).fontWeight(.heavy).padding(.vertical, -20)
            }
            HStack(alignment: .bottom) {
                ZStack {
                    Text("TRERMPS").kerning(10).font(.system(size: 30)).italic().foregroundColor(.black).fontWeight(.heavy).offset(x: 4, y: 0)
                    Text("TRERMPS").kerning(10).font(.system(size: 30)).italic().foregroundColor(.white).fontWeight(.heavy).offset(x: 2, y: 0)
                    Text("TRERMPS").kerning(10).font(.system(size: 30)).italic().foregroundColor(Color(red: 215/255, green: 43/255, blue: 43/255)).fontWeight(.heavy)
                }
                Text("TM").font(.system(size: 8)).padding(.horizontal, -10).padding(.vertical, 5)
            }
        }
    }
}
