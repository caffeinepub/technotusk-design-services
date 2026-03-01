import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";

actor {
  type ProjectType = {
    #commercial;
    #residential;
    #industrial;
    #other;
  };

  type Inquiry = {
    name : Text;
    email : Text;
    projectType : ProjectType;
    message : Text;
  };

  module Inquiry {
    public func compareByEmail(x : Inquiry, y : Inquiry) : Order.Order {
      Text.compare(x.email, y.email);
    };
  };

  let inquiries = Map.empty<Text, Inquiry>();
  var inquiryCount = 0;

  public shared ({ caller }) func submitInquiry(id : Text, name : Text, email : Text, projectType : ProjectType, message : Text) : async () {
    let newInquiry : Inquiry = {
      name;
      email;
      projectType;
      message;
    };
    inquiries.add(id, newInquiry);
    inquiryCount += 1;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray().sort(Inquiry.compareByEmail);
  };

  public query ({ caller }) func getInquiryCount() : async Nat {
    inquiryCount;
  };
};
