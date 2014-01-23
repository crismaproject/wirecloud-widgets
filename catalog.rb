require 'rest_client'
require 'json'

module CRISMA
  # Facade for the CRISMA catalogue REST-ful service API
  # @version 1.0
  # @author Manuel Warum (Austrian Institute of Technology)
  class Catalog
    LOGIN_URI = 'https://crisma-cat.ait.ac.at/service/user/login'
    TOKEN_URI = 'https://crisma-cat.ait.ac.at/services/session/token'
    CATALOGUE_URI = 'https://crisma-cat.ait.ac.at/service/entity_node'

    attr_accessor :headers

    def initialize
      self.headers = {
          'X-CSRF-Token' => '',
          :content_type => :json,
          :accept => :json
      }
    end

    # @param [String] username
    # @param [String] password
    def authenticate(username, password)
      login_data = dispatch :post, LOGIN_URI, { :username => username, :password => password }.to_json
      self.headers[:cookies] = login_data.cookies
      token_data = dispatch :get, TOKEN_URI
      self.headers['X-CSRF-Token'] = token_data
    end

    # @param [Integer] component_id
    # @param [String] title
    # @param [String] description
    # @param [String] version
    def update_component(component_id, title = nil, description = nil, version = nil)
      update_data = { :log => 'Programmatic update' }
      update_data[:title] = title if title
      update_data[:body] = { :value => description, :format => 'filtered_html' } if description
      update_data[:software_version] = version if version
      update_node component_id, update_data
    end

    # @param [Integer] node_id
    # @param [Object] data
    def update_node(node_id, data)
      dispatch :put, "#{CATALOGUE_URI}/#{node_id}.json", data.to_json
    end

    # @param [Symbol] method :get, :post, :put, :patch, or :delete
    # @param [String] uri
    # @param [Object] data optional data that will be sent as JSON payload for :put, :post, and :patch requests
    private
    def dispatch(method, uri, data = nil)
      case method
        when :get, :delete
          RestClient.method(method).call(uri, headers) do |response, _, result|
            if result.code != 200
              puts "HTTP #{result.code}: #{result.msg}" if result.msg
            else
              yield response if block_given?
            end
            response
          end
        when :put, :post, :patch
          RestClient.method(method).call(uri, data, headers) do |response, _, result|
            if result.code != 200
              puts "HTTP #{result.code}: #{result.msg}" if result.msg
            else
              yield response if block_given?
            end
            response
          end
        else
          raise "Don't know how to handle #{method} HTTP verb!"
      end
    end
  end
end