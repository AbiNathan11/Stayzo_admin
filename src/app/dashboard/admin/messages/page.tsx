"use client";

import React, { useState, useEffect } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  X,
  Calendar,
  Clock,
  User,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: 'Read' | 'Unread';
}



export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Read'>('All');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchMessages = () => {
    fetch('http://localhost:3001/api/contact', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((msg: any) => {
          const dateObj = new Date(msg.createdAt);
          return {
            id: msg.id,
            fullName: msg.fullName,
            email: msg.email,
            subject: msg.subject || 'General Inquiry',
            message: msg.message,
            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: msg.status
          };
        });
        setMessages(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentMsg = messages.find(m => m.id === id);
    if (!currentMsg) return;
    const nextStatus = currentMsg.status === 'Read' ? 'Unread' : 'Read';
    try {
      const res = await fetch(`http://localhost:3001/api/contact/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status: nextStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3001/api/contact/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplyText(''); // reset reply form when opening new message
    if (msg.status === 'Unread') {
      try {
        const res = await fetch(`http://localhost:3001/api/contact/${msg.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Read' })
        });
        if (res.ok) {
          fetchMessages();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setReplyLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/contact/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyMessage: replyText })
      });
      if (res.ok) {
        toast.success("Reply sent successfully via email!");
        setReplyText('');
        fetchMessages(); // Refresh message list status
        setSelectedMessage({ ...selectedMessage, status: 'Read' });
      } else {
        const errData = await res.json();
        toast.error(`Failed to send reply: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending the reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  // Filters logic
  const filteredMessages = messages.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Total Inquiries */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Total Contact Messages</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{messages.length}</h3>
            <span className="text-[11px] font-bold text-gray-400 block pt-1">
              Received from landing page form
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Unread Messages</span>
            <h3 className="text-3xl font-extrabold text-amber-500 tracking-tight">
              {messages.filter(m => m.status === 'Unread').length}
            </h3>
            <span className="text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
              Requires attention
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
            <Mail className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Read Inquiries */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Archived / Read</span>
            <h3 className="text-3xl font-extrabold text-emerald-500 tracking-tight">
              {messages.filter(m => m.status === 'Read').length}
            </h3>
            <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              Processed
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <MailOpen className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE WORKSPACE PANEL */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Toolbar controls */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 border-b border-gray-50 pb-5">
          <div>
            <h4 className="font-extrabold text-base text-gray-900">Inbox &amp; Inquiries</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit incoming contact inquiries and user issues</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2.5 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Status tabs */}
            <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-50">
              {[
                { key: 'All', label: 'All Inboxes' },
                { key: 'Unread', label: 'Unread' },
                { key: 'Read', label: 'Read' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer ${statusFilter === tab.key ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* INBOX LIST LAYOUT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="py-4 px-6 w-12 text-center">Status</th>
                <th className="py-4 px-6">Sender Details</th>
                <th className="py-4 px-6">Subject / Message preview</th>
                <th className="py-4 px-6">Sent Timestamp</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 font-semibold">
                    No contact messages found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`hover:bg-[#F8FAFB]/40 transition cursor-pointer ${
                      msg.status === 'Unread' ? 'bg-[#1A1A1A]/[0.01] font-black text-gray-950' : 'text-gray-500 font-semibold'
                    }`}
                  >
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        msg.status === 'Unread' ? 'bg-amber-500 animate-pulse' : 'bg-gray-200'
                      }`}></span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center font-extrabold text-xs text-[#1A1A1A] shrink-0 border border-gray-200/50">
                          {msg.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-gray-900 leading-tight">{msg.fullName}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-[320px]">
                      <p className="text-sm font-extrabold text-gray-900 leading-snug truncate">{msg.subject}</p>
                      <p className="text-gray-400 text-[10px] truncate leading-normal mt-0.5">{msg.message}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-semibold">
                      <div className="space-y-0.5">
                        <p className="text-gray-800 text-[11px] font-extrabold">{msg.date}</p>
                        <p className="text-[9px]">{msg.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2 text-xs select-none">
                        <button
                          onClick={(e) => toggleReadStatus(msg.id, e)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer border flex items-center space-x-1 ${
                            msg.status === 'Read'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                          title={msg.status === 'Read' ? 'Mark Unread' : 'Mark Read'}
                        >
                          {msg.status === 'Read' ? <MailOpen className="w-3.5 h-3.5 shrink-0" /> : <Mail className="w-3.5 h-3.5 shrink-0" />}
                          <span>{msg.status === 'Read' ? 'Read' : 'Mark Read'}</span>
                        </button>
                        <button
                          onClick={(e) => deleteMessage(msg.id, e)}
                          className="bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white p-2 rounded-xl transition cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* DETAILED MESSAGE DRAWER */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-8">

              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-5">
                <div>
                  <span className="bg-[#1A1A1A] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">Stayzo Contact System</span>
                  <h3 className="font-extrabold text-xl text-gray-900 mt-2">Message View</h3>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subject details card */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-1">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">Message Subject</span>
                <h4 className="text-base font-extrabold text-gray-950 leading-snug">{selectedMessage.subject}</h4>
              </div>

              {/* Message Payload Body */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Message Body</h5>
                <p className="text-xs font-bold text-gray-800 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl leading-relaxed select-text">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Sender Metadata details */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Sender Entity Metadata</h5>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Sender Full Name</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedMessage.fullName}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Sender Email</p>
                    <p className="text-gray-800 font-extrabold mt-1 truncate select-all">{selectedMessage.email}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Date Sent</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedMessage.date}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Time Sent</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedMessage.time}</p>
                  </div>
              </div>
            </div>

            {/* Message Reply Form */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Send Email Reply via Gmail</h5>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your support reply message here..."
                  className="w-full min-h-[100px] bg-[#F8FAFB] border border-gray-200/50 rounded-2xl p-4 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-[#1A1A1A] transition resize-none"
                />
                <button
                  onClick={handleSendReply}
                  disabled={replyLoading || !replyText.trim()}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 rounded-2xl text-xs font-extrabold uppercase transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>{replyLoading ? 'Sending Reply...' : 'Send Reply via Gmail'}</span>
                </button>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center gap-3">
              <button
                onClick={(e) => { toggleReadStatus(selectedMessage.id, e); }}
                className="w-full border border-gray-250 hover:bg-gray-50 text-gray-700 py-3 rounded-2xl text-xs font-extrabold uppercase transition cursor-pointer"
              >
                Mark as {selectedMessage.status === 'Read' ? 'Unread' : 'Read'}
              </button>
              <button
                onClick={(e) => { deleteMessage(selectedMessage.id, e); }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl text-xs font-extrabold uppercase transition cursor-pointer"
              >
                Delete Message
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
