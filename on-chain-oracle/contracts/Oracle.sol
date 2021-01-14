/**
 *Submitted for verification at Etherscan.io on 2021-01-13
 */

pragma solidity ^0.5.17;

contract Oracle {
    Request[] public requests;
    uint256 public currentId = 0;
    uint256 public minQuorum = 2;
    uint256 public totalOracleCount = 3;

    mapping(string => uint256) public ratings;

    uint8 constant notTrusted = 0;
    uint8 constant trustedAndNotVoted = 1;
    uint8 constant trustedAndVoted = 2;

    struct Request {
        uint256 id;
        string ethAddress;
        string attribute;
        uint256 agreedValue;
        bool resolved;
        mapping(uint256 => uint256) answers; //answer => number of votes
        mapping(address => uint256) quorum; //address => trusted or not, voted or not
    }

    event NewRequest(uint256 id, string ethAddress, string attribute);

    event UpdatedRequest(
        uint256 id,
        string ethAddress,
        string attribute,
        uint256 agreedValue
    );

    function createRequest(string memory _ethAddress, string memory _attribute)
        public
    {
        uint256 length =
            requests.push(
                Request({
                    id: currentId,
                    ethAddress: _ethAddress,
                    attribute: _attribute,
                    agreedValue: 0, // if resolved is true then read agreedValue
                    resolved: false // if resolved is false then agreedValue do not matter
                })
            );

        Request storage r = requests[length - 1];

        r.quorum[
            address(0xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c)
        ] = trustedAndNotVoted;
        r.quorum[
            address(0xf3Dd04C449669a89a7cF492c6fA8EF9aF388Ebd8)
        ] = trustedAndNotVoted;
        r.quorum[
            address(0xA99Ccd923D1807c5C09aDC74f2ae08D1B5884619)
        ] = trustedAndNotVoted;

        emit NewRequest(currentId, _ethAddress, _attribute);
        currentId++;
    }

    function updateRequest(uint256 _id, uint256 _valueRetrieved) public {
        Request storage req = requests[_id];

        require(
            req.resolved == false,
            "Error: Consensus is complete so you can not vote."
        );
        require(
            req.quorum[address(msg.sender)] == trustedAndNotVoted,
            "Error: You can not vote."
        );

        req.quorum[msg.sender] = trustedAndVoted;
        if (minQuorum <= ++req.answers[_valueRetrieved]) {
            req.resolved = true;
            req.agreedValue = _valueRetrieved;
            ratings[req.ethAddress] = _valueRetrieved;
            emit UpdatedRequest(
                req.id,
                req.ethAddress,
                req.attribute,
                req.agreedValue
            );
        }
    }
}
