pragma solidity ^0.5.16;

contract Oracle {
    Request[] public requests;
    uint256 public currentId = 0;
    uint256 public minQuorum = 2;
    uint256 public totalOracleCount = 3;

    uint8 constant notTrusted = 0;
    uint8 constant trustedAndNotVoted = 1;
    uint8 constant trustedAndVoted = 2;

    struct Request {
        uint256 id;
        string url;
        string attribute;
        string agreedValue;
        mapping(string => uint256) answers;
        mapping(address => uint256) quorum;
    }

    event NewRequest(uint256 id, string url, string attribute);

    event UpdatedRequest(
        uint256 id,
        string url,
        string attribute,
        string agreedValue
    );

    function createRequest(string memory _url, string memory _attribute)
        public
    {
        uint256 length =
            requests.push(
                Request({
                    id: currentId,
                    url: _url,
                    attribute: _attribute,
                    agreedValue: ""
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

        emit NewRequest(currentId, _url, _attribute);
        currentId++;
    }

    function updateRequest(uint256 _id, string memory _valueRetrieved) public {
        Request storage req = requests[_id];
        require(
            req.quorum[address(msg.sender)] == trustedAndNotVoted,
            "Error: You can not vote."
        );

        req.quorum[msg.sender] = trustedAndVoted;
        if (minQuorum <= ++req.answers[_valueRetrieved]) {
            req.agreedValue = _valueRetrieved;
            emit UpdatedRequest(
                req.id,
                req.url,
                req.attribute,
                req.agreedValue
            );
        }
    }

    function getVotesOfAnswerOfRequest(
        uint256 _requestIndex,
        string memory _answer
    ) public view returns (uint256) {
        return requests[_requestIndex].answers[_answer];
    }
}
