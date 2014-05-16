#require 'singleton'
require 'mechanize'
require 'json'
require 'pp'
require 'uri'
#require 'logger'

class Wirecloud
  #include Singleton

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
      #config.log = Logger.new('log.txt')
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
    raise StandardError unless File.exists?(file)
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
end