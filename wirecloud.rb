require 'mechanize'
require 'nokogiri'
require 'json'
require 'pp'
require 'uri'

class Wirecloud
  LOGIN_PATH = '/login'
  WORKSPACES_PATH = '/api/workspaces'
  RESOURCES_PATH = '/api/resources'
  RESOURCE_PATH = '/api/resource/%{vendor}/%{name}/%{version}'

  attr_accessor :agent
  attr_accessor :base_uri

  def initialize(base_uri)
    self.base_uri = base_uri
    self.agent = Mechanize.new do |config|
      config.follow_redirect = true
    end
  end

  def login!(username, password)
    agent.get(base_uri + LOGIN_PATH) do |login_page|
      login_page.form_with(:class => 'formee') do |login_form|
        login_form['username'] = username
        login_form['password'] = password
      end

      response = agent.submit(login_page.forms.first, login_page.forms.first.buttons.first)
      return Integer(response.code) < 400
    end
  end

  def upload_resource!(file)
    raise StandardError.new unless File.exists?(file)
    agent.post(base_uri + RESOURCES_PATH, {
        :force_create => true,
        :file => File.new(file, 'rb')
    })
  end

  def resources
    agent.get(base_uri + RESOURCES_PATH) do |resources|
      return JSON.parse resources.body unless resources.code != '200'
    end
  end

  def delete_resource!(vendor, name, version)
    path = URI.encode(RESOURCE_PATH % { :vendor => vendor, :name => name, :version => version })
    agent.delete(base_uri + path)
  end

  def workspaces
    agent.get(base_uri + WORKSPACES_PATH) do |workspaces|
      return JSON.parse workspaces.body unless workspaces.code != '200'
    end
  end

  def workspace(id)
    agent.get(base_uri + WORKSPACES_PATH + "/#{id}") do |workspace|
      return JSON.parse workspace.body unless workspace.code != '200'
    end
  end


  def self.inspect_config_file(config_file)
    raise StandardError.new('No such file') unless File.exists?(config_file)
    doc = Nokogiri::XML(open(config_file))
    inspect_config(doc)
  end

  def self.inspect_config(doc)
    doc_namespaces = doc.namespaces
    if doc_namespaces['xmlns'] =~ /wirecloud\.conwet\.fi\.upm\.es/i
      # wirecloud xml format
      {vendor: doc.css('Vendor').text,
       name: doc.css('Name').text,
       version: doc.css('Version').text,
       format: 'wirecloud'}
    elsif doc_namespaces['xmlns:rdf'] =~ /www\.w3\.org\/1999\/02\/22-rdf-syntax-ns/i
      # RDF xml format
      {vendor: doc.xpath('//gr:BusinessEntity[@rdf:about="http://vendoruri/"]/foaf:name').text,
       name: doc.xpath('//wire:Operator/dcterms:title|//wire:Widget/dcterms:title').text,
       version: doc.xpath('//wire:Operator/usdl-core:versionInfo|//wire:Widget/usdl-core:versionInfo').text,
       format: 'rdf'}
    else
      {format: 'unknown'}
    end
  end
end