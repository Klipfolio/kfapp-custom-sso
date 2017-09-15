#!/usr/bin/perl 

package KlipfolioToken;

use Crypt::CBC;
use Digest::SHA;
use URI::Escape;
use MIME::Base64;
use JSON;

sub rndStr{ join'', @_[ map{ rand @_ } 1 .. shift ] }

sub new {
  my $class = shift;    
  my $self = {};

  # go to: https://app.klipfolio.com/settings/single_signon_edit
  # to find your companyId and secretKey
  # --------------------------------------------------------------

  $self->{'klipfolio_company_id'} = ''; # Your Klipfolio Company ID
  $self->{'sso_key'} = ''; # Your SSO Key
  $self->{'iv'} = rndStr 16, 'A'..'Z', 0..9, 'a'..'z', '-', '_', '.'; #randomly generate 16 bit value
  $self->{'meth'} = "Crypt::Rijndael";

  bless $self, $class;
  return $self;
}

sub create {
  my $self = shift;
  my $hash = shift;

  my $json = new JSON;
  my $data = $json->encode($hash);

  my $sha = new Digest::SHA;
  $sha->add( $self->{'sso_key'} . $self->{'klipfolio_company_id'} );
  my $key = substr($sha->hexdigest,0,32);

  # create cipher object
  $obj = Crypt::CBC->new (
  -key => pack("H*",$key),
  -literal_key => 1,
  -header => "none",
  -keysize => 16,
  -iv => $self->{'iv'},
  -cipher => $self->{'meth'}
  );

  # encrypt data
  $encdata = $obj->encrypt($self->{'iv'} . $data );
  return encode_base64( $encdata );
}

# Your User Data
my $user_data = { email => '' };
my $token = new KlipfolioToken;
print $token->create($user_data)
