//
//  WebsocketController.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//
// Liberally borrowed from: https://frzi.medium.com/a-simple-chat-app-with-swiftui-and-websockets-or-swift-in-the-back-swift-in-the-front-78b34c3dc912

import Foundation

class WebsocketController: ObservableObject {
    @Published var messages: [String]
    
    private var connection: URLSessionWebSocketTask?
    
    init() {
        self.messages = []
        self.connection = nil
    }
    
    func connect(battleId: String) -> Void {
        let url = URL(string: "ws://localhost:4002/ws/\(battleId)")!
        
        connection = URLSession.shared.webSocketTask(with: url)
        connection?.receive(completionHandler: onReceive)
        connection?.resume()
        
        connection?.sendPing{ error in
            if error != nil {
                print(error!.localizedDescription)
            }
        }
    }
    
    private func onReceive(incoming: Result<URLSessionWebSocketTask.Message, Error>) {
        switch incoming {
            case .success(let message):
                onMessage(message: message)
            case .failure(let error):
                print("WS error: \(error)")
        }
    }
    
    private func onMessage(message: URLSessionWebSocketTask.Message) {
        switch message {
            case .string(let text):
                DispatchQueue.main.async {
                    self.messages.append(text)
                }
            case .data(let data):
                print("WS received binary data: \(data)")
            @unknown default:
                print("WS being weird")
        }
    }
    
    func send(message: String) -> Void {
        if connection != nil {
            let text = URLSessionWebSocketTask.Message.string(message)
            connection!.send(text) { error in
                if error != nil {
                    print(error!.localizedDescription)
                }
            }
        }
    }
    
    func disconnect() -> Void {
        if connection != nil {
            connection!.cancel()
        }
    }
    
    deinit {
        disconnect()
    }
}
