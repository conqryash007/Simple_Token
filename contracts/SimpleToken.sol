// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ISimpleToken.sol";

contract SimpleToken is ISimpleToken {
    string private _name;
    string private _symbol;
    uint8 private _decimal;
    uint256 private _totalSupply;
    address payable public owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _approvals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimal_
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimal = decimal_;
        owner = payable(msg.sender);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimal;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "transfer to zero address");

        uint256 fromBalance = _balances[msg.sender];
        require(fromBalance >= _value, "Insufficient Balance!");

        unchecked {
            _balances[msg.sender] = fromBalance - _value;
            _balances[_to] += _value;
        }

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return _approvals[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        _approve(msg.sender, _spender, _value);
        return true;
    }

    function _approve(
        address _owner,
        address _spender,
        uint256 _value
    ) internal returns (bool) {
        require(_owner != address(0), "Zero Address!");
        require(_spender != address(0), "Zero Address!");

        _approvals[_owner][_spender] = _value;
        emit Approval(_owner, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        uint256 currAllowance = allowance(_from, msg.sender);

        require(currAllowance != type(uint256).max, "MAX LIMIT REACHED!");
        require(currAllowance >= _value, "Insufficient allowance");

        unchecked {
            _approve(_from, msg.sender, currAllowance - _value);
        }

        uint256 currBal = balanceOf(_from);
        require(currBal >= _value, "Insufficient Funds");

        unchecked {
            _balances[_from] = currBal - _value;
            _balances[_to] += _value;
        }

        emit Transfer(_from, _to, _value);

        return true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT OWNER!");
        _;
    }

    function mint(address _account, uint256 _amount)
        public
        onlyOwner
        returns (bool)
    {
        _mint(_account, _amount);
        return true;
    }

    function _mint(address _account, uint256 _amount) internal returns (bool) {
        require(_account != address(0), "ERC20: mint to the zero address");
        _totalSupply += _amount;
        unchecked {
            _balances[_account] += _amount;
        }
        emit Transfer(address(0), _account, _amount);
        return true;
    }
}
